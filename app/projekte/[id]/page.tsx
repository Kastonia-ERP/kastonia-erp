"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Shell from "../../../components/Shell";
import { eur, useStore } from "../../../lib/store";
import { PROJECT_PHASES, PROJECT_PRIORITIES, PROJECT_STATUSES, Project } from "../../../lib/types";
import { summarizeProjectOffers } from "../../../lib/models/offer-engine";
import { PROJECT_RECORD_STEPS, calculateOpenCustomerPayment, calculateOpenSupplierPayment, calculateProjectMargin, calculateProjectMarginPercent, findProjectById, getProjectRecordStepIndex } from "../../../lib/models/project-helpers";

const fmtDate = (v?: string) => (v ? new Date(v).toLocaleDateString("de-DE") : "nicht hinterlegt");
const address = (a?: Project["projectAddress"]) => (a ? [a.street, a.postalCode, a.city, a.country].filter(Boolean).join(", ") : "nicht hinterlegt");
const Empty = ({ text }: { text: string }) => <p className="emptyState">{text}</p>;
const List = ({ children }: { children: React.ReactNode }) => <div className="recordList">{children}</div>;
const projectRecordNav = [
  ["Kunde", "kunde"],
  ["Aufmaß", "aufmass"],
  ["Angebote", "angebote"],
  ["Einkauf", "einkauf"],
  ["Lieferungen", "lieferungen"],
  ["Status", "status"],
  ["Phase", "phase"],
  ["Finanzen", "finanzen"],
  ["Dokumente", "dokumente"],
  ["Montage", "montage"],
  ["Rechnungen", "rechnungen"],
  ["Kommunikation", "kommunikation"],
  ["Notizen", "notizen"],
  ["Aufgaben", "aufgaben"],
  ["Termine", "termine"],
];
const projectTypes: Project["projectType"][] = ["Terrassendach", "Markise", "Lamellendach", "Carport", "Sonnenschutz", "Service", "Sonstiges"];
const emptyMeasurement = {
  date: new Date().toISOString().slice(0, 10),
  responsible: "",
  widthMm: "",
  depthMm: "",
  heightMm: "",
  notes: "",
};
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="infoRow">
      <span>{label}</span>
      <b>{value || "nicht hinterlegt"}</b>
    </div>
  );
}
function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section className="panel recordSection" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export default function ProjectRecord() {
  const { state, update } = useStore();
  const params = useParams<{ id: string }>();
  const project = findProjectById(state.projects, params.id);
  const [editing, setEditing] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState("");
  const [measurement, setMeasurement] = useState(emptyMeasurement);
  const [form, setForm] = useState(
    project
      ? {
          title: project.title,
          customer: project.customer,
          projectType: project.projectType,
          status: project.status,
          phase: project.phase,
          priority: project.priority,
          responsible: project.responsible,
          montage: project.montage,
          street: project.projectAddress.street,
          postalCode: project.projectAddress.postalCode,
          city: project.projectAddress.city,
        }
      : null,
  );
  if (!project)
    return (
      <Shell>
        <div className="panel notFound">
          <h1>Projekt nicht gefunden</h1>
          <p>Für diese Projekt-ID ist keine Projektakte vorhanden.</p>
          <Link className="primary" href="/projekte">
            Zurück zu Projekte
          </Link>
        </div>
      </Shell>
    );
  const offerSummary = summarizeProjectOffers(project, state.offers);
  const projectPurchaseOrders = state.purchaseOrders.filter((o) => o.projectId === project.id);
  const projectDeliveries = state.deliveries.filter((d) => d.projectId === project.id);
  const projectSuppliers = state.suppliers.filter((s) => projectPurchaseOrders.some((o) => o.supplierId === s.id));
  const f = project.financials;
  const step = getProjectRecordStepIndex(project.status);
  const contact = project.contactPersons?.[0];
  const projectAddress = address(project.projectAddress);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(projectAddress)}`;
  const saveProject = () => {
    if (!form || !form.title.trim() || !form.customer.trim()) return;
    update("projects", project.id, {
      ...project,
      title: form.title.trim(),
      customer: form.customer,
      projectType: form.projectType,
      status: form.status,
      phase: form.phase,
      priority: form.priority,
      responsible: form.responsible.trim(),
      montage: form.montage,
      projectAddress: {
        ...project.projectAddress,
        street: form.street.trim(),
        postalCode: form.postalCode.trim(),
        city: form.city.trim(),
      },
      updatedAt: new Date().toISOString(),
    });
    setEditing(false);
  };
  const resetMeasurement = () => {
    setMeasurement(emptyMeasurement);
    setEditingMeasurement("");
  };
  const saveMeasurement = () => {
    if (!measurement.date) return;
    const item = {
      id: editingMeasurement || `A-${Date.now()}`,
      date: measurement.date,
      responsible: measurement.responsible.trim(),
      widthMm: measurement.widthMm ? Number(measurement.widthMm) : undefined,
      depthMm: measurement.depthMm ? Number(measurement.depthMm) : undefined,
      heightMm: measurement.heightMm ? Number(measurement.heightMm) : undefined,
      notes: measurement.notes.trim(),
    };
    const measurements = editingMeasurement ? project.measurements.map((entry) => (entry.id === editingMeasurement ? item : entry)) : [...project.measurements, item];
    update("projects", project.id, {
      ...project,
      measurements,
      status: project.status === "Neue Anfrage" || project.status === "Kontaktaufnahme" || project.status === "Termin vereinbart" ? "Aufmaß" : project.status,
      updatedAt: new Date().toISOString(),
    });
    resetMeasurement();
  };
  return (
    <Shell>
      <div className="recordBreadcrumb">
        <Link href="/projekte">Projekt</Link>
        <span>↓</span>
        <strong>Projektakte</strong>
      </div>
      <div className="projectHero">
        <div>
          <span className="eyebrow">PROJEKTAKTE {project.projectNumber}</span>
          <h1>{project.title}</h1>
          <p>{project.customer}</p>
          <div className="chips">
            <span className="status blue">{project.status}</span>
            <span className="status green">{project.phase}</span>
            <span className="badge">{project.priority}</span>
          </div>
        </div>
        <div className="actions">
          <Link className="ghostBtn" href="/projekte">
            Zurück zu Projekte
          </Link>
          <button className="primary" onClick={() => setEditing(!editing)}>
            Projekt bearbeiten
          </button>
        </div>
      </div>
      <nav className="recordNav" aria-label="Projektaktenbereiche">
        {projectRecordNav.map(([label, id]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <div className="panel metaGrid">
        <Row label="Verantwortlicher" value={project.responsible} />
        <Row label="Erstellt" value={fmtDate(project.createdAt)} />
        <Row label="Zuletzt geändert" value={fmtDate(project.updatedAt)} />
        <Row label="Letztes Angebot" value={offerSummary.lastOffer?.offerNumber} />
        <Row label="Aktuelles Angebot" value={offerSummary.currentOffer?.offerNumber} />
        <Row label="Anzahl Angebote" value={offerSummary.count} />
        <Row label="Gesamtwert Angebote" value={eur(offerSummary.totalValue)} />
        <Row label="Angebotsstatus" value={offerSummary.status} />
      </div>
      {editing && form && (
        <div className="panel">
          <h2>Projekt bearbeiten</h2>
          <div className="formGrid">
            <label>
              Projektbezeichnung *
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              Kunde *
              <select value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}>
                {state.customers.map((customer) => (
                  <option key={customer.id}>{customer.name}</option>
                ))}
              </select>
            </label>
            <label>
              Projekttyp
              <select
                value={form.projectType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    projectType: e.target.value as Project["projectType"],
                  })
                }
              >
                {projectTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as Project["status"],
                  })
                }
              >
                {PROJECT_STATUSES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Phase
              <select
                value={form.phase}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phase: e.target.value as Project["phase"],
                  })
                }
              >
                {PROJECT_PHASES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Priorität
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as Project["priority"],
                  })
                }
              >
                {PROJECT_PRIORITIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Verantwortlicher
              <input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} />
            </label>
            <label>
              Montagetermin
              <input type="date" value={form.montage || ""} onChange={(e) => setForm({ ...form, montage: e.target.value })} />
            </label>
            <label>
              Straße und Hausnummer
              <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </label>
            <label>
              PLZ
              <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            </label>
            <label>
              Ort
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </label>
          </div>
          <div className="actions">
            <button className="primary" onClick={saveProject}>
              Änderungen speichern
            </button>
            <button className="ghostBtn" onClick={() => setEditing(false)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
      <div className="panel" id="status">
        <h2>Projektfortschritt</h2>
        <div className="stepper">
          {PROJECT_RECORD_STEPS.map((s, i) => (
            <div key={s} className={`step ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}>
              <i>{i < step ? "✓" : i + 1}</i>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="recordGrid">
        <Section id="kunde" title="Kunde">
          <Row label="Kundenname" value={project.customer} />
          <Row label="Ansprechpartner" value={contact?.name} />
          <Row label="Telefonnummer" value={contact?.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : project.customerDetails?.phone} />
          <Row label="Mobilnummer" value={contact?.mobile} />
          <Row label="E-Mail" value={contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : project.customerDetails?.email} />
          <Row
            label="Projektadresse"
            value={
              <a href={maps} target="_blank">
                {projectAddress}
              </a>
            }
          />
          <Row label="Rechnungsadresse" value={address(project.billingAddress)} />
          <Row label="Leadquelle" value={project.leadSource} />
          <Row label="OBI-Lead" value={project.isObiLead ? "Ja" : "Nein"} />
        </Section>
        <Section id="phase" title="Phase">
          <Row label="Projekttyp" value={project.projectType} />
          <Row label="Projektstatus" value={project.status} />
          <Row label="Projektphase" value={project.phase} />
          <Row label="Priorität" value={project.priority} />
          <Row label="Verantwortlicher" value={project.responsible} />
          <Row label="Montagetermin" value={fmtDate(project.montage)} />
          <Row label="Tags" value={project.tags?.join(", ")} />
          <Row label="Archiviert" value={project.archived ? "Ja" : "Nein"} />
        </Section>
        <Section id="finanzen" title="Finanzen">
          <Row label="erwarteter Umsatz netto" value={eur(f.expectedRevenueNet)} />
          <Row label="erwarteter Umsatz brutto" value={eur(f.expectedRevenueGross)} />
          <Row label="erwartete Kosten netto" value={eur(f.expectedCostNet)} />
          <Row label="erwartete Kosten brutto" value={eur(f.expectedCostGross)} />
          <Row label="Marge netto" value={eur(calculateProjectMargin(f))} />
          <Row label="Marge in Prozent" value={`${calculateProjectMarginPercent(f)} %`} />
          <Row label="vom Kunden bezahlt" value={eur(f.customerPaid)} />
          <Row label="offene Kundenzahlung" value={eur(calculateOpenCustomerPayment(f))} />
          <Row label="an Lieferanten bezahlt" value={eur(f.supplierPaid)} />
          <Row label="offene Lieferantenzahlung" value={eur(calculateOpenSupplierPayment(f))} />
        </Section>
      </div>
      <div className="sectionsGrid">
        <Section id="aufmass" title="Aufmaß">
          <div className="formGrid">
            <label>
              Datum *
              <input type="date" value={measurement.date} onChange={(e) => setMeasurement({ ...measurement, date: e.target.value })} />
            </label>
            <label>
              Verantwortlicher
              <input
                value={measurement.responsible}
                onChange={(e) =>
                  setMeasurement({
                    ...measurement,
                    responsible: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Breite in mm
              <input type="number" min="0" value={measurement.widthMm} onChange={(e) => setMeasurement({ ...measurement, widthMm: e.target.value })} />
            </label>
            <label>
              Tiefe in mm
              <input type="number" min="0" value={measurement.depthMm} onChange={(e) => setMeasurement({ ...measurement, depthMm: e.target.value })} />
            </label>
            <label>
              Höhe in mm
              <input type="number" min="0" value={measurement.heightMm} onChange={(e) => setMeasurement({ ...measurement, heightMm: e.target.value })} />
            </label>
            <label>
              Notizen
              <textarea value={measurement.notes} onChange={(e) => setMeasurement({ ...measurement, notes: e.target.value })} />
            </label>
          </div>
          <div className="actions">
            <button className="primary" onClick={saveMeasurement}>
              {editingMeasurement ? "Aufmaß aktualisieren" : "Aufmaß speichern"}
            </button>
            {editingMeasurement && (
              <button className="ghostBtn" onClick={resetMeasurement}>
                Abbrechen
              </button>
            )}
          </div>
          {project.measurements?.length ? (
            <List>
              {project.measurements.map((x) => (
                <p key={x.id}>
                  <b>{fmtDate(x.date)}</b> · {x.responsible || "ohne Verantwortlichen"}
                  <br />
                  <small>
                    Breite {x.widthMm ? `${x.widthMm} mm` : "—"} · Tiefe {x.depthMm ? `${x.depthMm} mm` : "—"} · Höhe {x.heightMm ? `${x.heightMm} mm` : "—"}
                    {x.notes ? ` · ${x.notes}` : ""}
                  </small>
                  <br />
                  <button
                    className="ghostBtn"
                    onClick={() => {
                      setEditingMeasurement(x.id);
                      setMeasurement({
                        date: x.date,
                        responsible: x.responsible || "",
                        widthMm: x.widthMm ? String(x.widthMm) : "",
                        depthMm: x.depthMm ? String(x.depthMm) : "",
                        heightMm: x.heightMm ? String(x.heightMm) : "",
                        notes: x.notes || "",
                      });
                    }}
                  >
                    Bearbeiten
                  </button>{" "}
                  <button
                    className="danger"
                    onClick={() => {
                      if (!window.confirm("Dieses Aufmaß wirklich löschen?")) return;
                      update("projects", project.id, {
                        ...project,
                        measurements: project.measurements.filter((entry) => entry.id !== x.id),
                        updatedAt: new Date().toISOString(),
                      });
                      if (editingMeasurement === x.id) resetMeasurement();
                    }}
                  >
                    Löschen
                  </button>
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch kein Aufmaß vorhanden" />
          )}
        </Section>
        <Section id="angebote" title="Angebote">
          <p>
            <a className="primary" href="/angebote">
              Angebote öffnen
            </a>
          </p>
          {project.offers?.length ? (
            <List>
              {project.offers.map((x) => (
                <p key={x.id}>
                  <b>{x.offerNumber || x.id}</b> · {x.title} · {eur(x.gross || x.net)}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch kein Angebot vorhanden" />
          )}
        </Section>
        <Section title="Auftragsbestätigungen">
          {project.orderConfirmations?.length ? (
            <List>
              {project.orderConfirmations.map((x) => (
                <p key={x.id}>
                  {x.number} · {x.status} · {eur(x.gross)}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Auftragsbestätigung vorhanden" />
          )}
        </Section>
        <Section id="einkauf" title="Lieferantenbestellungen">
          <p>
            <a className="primary" href="/einkauf">
              Einkauf öffnen
            </a>
          </p>
          {projectSuppliers.length ? (
            <p>
              <b>Lieferanten:</b> {projectSuppliers.map((s) => s.companyName).join(", ")}
            </p>
          ) : null}
          {projectPurchaseOrders.length ? (
            <List>
              {projectPurchaseOrders.map((x) => (
                <p key={x.id}>
                  <b>{x.orderNumber}</b> · {x.supplierName} · {x.status} · {eur(x.netTotal)}
                </p>
              ))}
            </List>
          ) : project.supplierOrders?.length ? (
            <List>
              {project.supplierOrders.map((x) => (
                <p key={x.id}>
                  {x.supplierName} · {x.status} · {eur(x.gross)}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Lieferantenbestellung vorhanden" />
          )}
        </Section>
        <Section id="lieferungen" title="Lieferungen">
          <p>
            <a className="primary" href="/lieferungen">
              Lieferungen öffnen
            </a>
          </p>
          {projectDeliveries.length ? (
            <List>
              {projectDeliveries.map((x) => (
                <p key={x.id}>
                  <b>{x.deliveryNoteNumber || x.id}</b> · {x.deliveryDate} · {x.status}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Lieferung vorhanden" />
          )}
        </Section>
        <Section id="dokumente" title="Dokumente">
          {project.documents?.length ? (
            <List>
              {project.documents.map((x) => (
                <p key={x.id}>
                  {x.type} · {x.name}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Dokumente vorhanden" />
          )}
        </Section>
        <Section id="montage" title="Montage">
          {project.installations?.length ? (
            <List>
              {project.installations.map((x) => (
                <p key={x.id}>
                  {fmtDate(x.plannedStart)} · {x.status} · {x.team?.join(", ")}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch kein Montagetermin hinterlegt" />
          )}
        </Section>
        <Section id="rechnungen" title="Rechnungen">
          {project.invoices?.length || project.payments?.length ? (
            <List>
              {[...project.invoices, ...project.payments].map((x) => (
                <p key={x.id}>
                  {"number" in x ? x.number : x.reference || x.id} · {"amount" in x ? eur(x.amount) : eur(x.gross || x.net)}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Rechnungen oder Zahlungen vorhanden" />
          )}
        </Section>
        <Section id="kommunikation" title="Kommunikation">
          {project.communication?.length ? (
            <List>
              {project.communication.map((x) => (
                <p key={x.id}>
                  {fmtDate(x.date)} · {x.channel} · {x.summary}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Kommunikation erfasst" />
          )}
        </Section>
        <Section id="notizen" title="Notizen">
          {project.notes?.length ? (
            <List>
              {project.notes.map((x) => (
                <p key={x.id}>
                  {fmtDate(x.createdAt)} · {x.text}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Notizen vorhanden" />
          )}
        </Section>
        <Section id="aufgaben" title="Aufgaben">
          {project.tasks?.length ? (
            <List>
              {project.tasks.map((x) => (
                <p key={x.id}>
                  {x.done ? "✓" : "○"} {x.title} · {fmtDate(x.due)}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Aufgaben vorhanden" />
          )}
        </Section>
        <Section id="termine" title="Termine">
          {project.appointments?.length ? (
            <List>
              {project.appointments.map((x) => (
                <p key={x.id}>
                  {fmtDate(x.date)} · {x.title}
                </p>
              ))}
            </List>
          ) : (
            <Empty text="Noch keine Termine vorhanden" />
          )}
        </Section>
      </div>
    </Shell>
  );
}
