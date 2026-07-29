"use client";
import Link from "next/link";
import Shell from "../../components/Shell";
import { useStore, eur } from "../../lib/store";
import { useState } from "react";
import { PROJECT_STATUSES } from "../../lib/types";
import { normalizeProject } from "../../lib/store";

const fmt = (v?: string) => (v ? new Date(v).toLocaleDateString("de-DE") : "offen");
const emptyCustomer = {
  firstName: "",
  lastName: "",
  street: "",
  postalCode: "",
  city: "",
  phone: "",
  email: "",
};
export default function Page() {
  const { state, add } = useStore();
  const [f, setF] = useState({
    customer: "",
    title: "",
    value: 0,
    status: "Neue Anfrage",
    montage: "",
    assignedEmployeeIds: [] as string[],
  });
  const [customer, setCustomer] = useState(emptyCustomer);
  const [customerMessage, setCustomerMessage] = useState("");
  const saveCustomer = () => {
    const firstName = customer.firstName.trim();
    const lastName = customer.lastName.trim();
    if (!firstName || !lastName) {
      setCustomerMessage("Bitte Vorname und Nachname eingeben.");
      return;
    }
    const name = `${firstName} ${lastName}`;
    add("customers", {
      id: `K-${Date.now()}`,
      name,
      firstName,
      lastName,
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      city: customer.city.trim(),
      status: "Aktiv",
      address: {
        street: customer.street.trim(),
        postalCode: customer.postalCode.trim(),
        city: customer.city.trim(),
        country: "DE",
      },
    });
    setF((current) => ({ ...current, customer: name }));
    setCustomer(emptyCustomer);
    setCustomerMessage(`${name} wurde angelegt und für das neue Projekt ausgewählt.`);
  };
  return (
    <Shell>
      <div className="pageHead">
        <div>
          <span className="eyebrow">PROJEKTSTEUERUNG · AUFMASS</span>
          <span className="prepBadge">In Vorbereitung</span><h1>Projekte & Aufmaß</h1>
          <p>Kunden anlegen, Projekte verwalten und das Aufmaß direkt in der jeweiligen Projektakte bearbeiten.</p>
        </div>
      </div>
      <div className="panel">
        <h2>Neuen Kunden anlegen</h2>
        <div className="formgrid">
          <input placeholder="Vorname *" aria-label="Vorname" value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
          <input placeholder="Nachname *" aria-label="Nachname" value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
          <input placeholder="Straße und Hausnummer" aria-label="Straße und Hausnummer" value={customer.street} onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
          <input placeholder="PLZ" aria-label="Postleitzahl" value={customer.postalCode} onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })} />
          <input placeholder="Ort" aria-label="Ort" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
          <input type="tel" placeholder="Telefon" aria-label="Telefon" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <input type="email" placeholder="E-Mail" aria-label="E-Mail" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          <button type="button" onClick={saveCustomer}>
            Kunde speichern
          </button>
        </div>
        {customerMessage && (
          <p className="notice" role="status">
            {customerMessage}
          </p>
        )}
      </div>
      <div className="panel">
        <h2>Neues Projekt</h2>
        <div className="formgrid">
          <select value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value })}>
            <option value="">Kunde wählen</option>
            {state.customers.map((x) => (
              <option key={x.id}>{x.name}</option>
            ))}
          </select>
          <input placeholder="Projekt" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <input type="number" placeholder="Auftragswert" value={f.value || ""} onChange={(e) => setF({ ...f, value: +e.target.value })} />
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
            {PROJECT_STATUSES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <input type="date" value={f.montage} onChange={(e) => setF({ ...f, montage: e.target.value })} />
          <fieldset className="employeePicker">
            <legend>Mitarbeiter zuordnen</legend>
            {state.employees.filter((employee) => employee.active).map((employee) => (
              <label key={employee.id}>
                <input type="checkbox" checked={f.assignedEmployeeIds.includes(employee.id)} onChange={() => setF({ ...f, assignedEmployeeIds: f.assignedEmployeeIds.includes(employee.id) ? f.assignedEmployeeIds.filter((id) => id !== employee.id) : [...f.assignedEmployeeIds, employee.id] })} />
                <span><b>{employee.name}</b><small>{employee.role}</small></span>
              </label>
            ))}
          </fieldset>
          <button
            onClick={() => {
              if (!f.customer || !f.title) return;
              add("projects", normalizeProject({ id: "P-" + Date.now(), ...f }, state.projects.length));
              setF({
                customer: "",
                title: "",
                value: 0,
                status: "Neue Anfrage",
                montage: "",
                assignedEmployeeIds: [],
              });
            }}
          >
            Projekt speichern
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="panelHead">
          <div>
            <h2>Projekte und Aufmaße</h2>
            <p className="muted">Projekt öffnen, um Kundendaten und Aufmaß gemeinsam zu bearbeiten.</p>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                {["Projektnummer", "Kunde", "Projektbezeichnung", "Aufmaß", "Projekttyp", "Status", "Phase", "Priorität", "Verantwortlicher", "Projektwert", "Montagetermin", "zuletzt geändert"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.projects.map((p) => (
                <tr key={p.id} className="clickRow">
                  <td>
                    <Link href={`/projekte/${p.id}`}>{p.projectNumber}</Link>
                  </td>
                  <td>{p.customer}</td>
                  <td>
                    <Link href={`/projekte/${p.id}`}>
                      <b>{p.title}</b>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/projekte/${p.id}#aufmass`}>{p.measurements?.length ? `${p.measurements.length} erfasst` : "Aufmaß öffnen"}</Link>
                  </td>
                  <td>{p.projectType}</td>
                  <td>
                    <span className="status blue">{p.status}</span>
                  </td>
                  <td>{p.phase}</td>
                  <td>
                    <span className="badge">{p.priority}</span>
                  </td>
                  <td>{p.responsible || "nicht zugewiesen"}</td>
                  <td>{eur(p.value)}</td>
                  <td>{fmt(p.montage)}</td>
                  <td>{fmt(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
