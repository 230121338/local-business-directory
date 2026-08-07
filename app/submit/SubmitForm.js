"use client";

import { useState } from "react";
import { validateBusinessSubmission } from "@/lib/utils";

const initialValues = {
  name: "",
  category: "",
  shortDescription: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  area: "",
  province: "",
  address: ""
};

export default function SubmitForm({ categories }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setValues(function (prev) {
      return Object.assign({}, prev, { [name]: value });
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateBusinessSubmission(values);
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const body = await response.json();
        if (body.errors) {
          setErrors(body.errors);
        } else {
          setServerError(body.error || "Something went wrong. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setValues(initialValues);
    } catch (error) {
      setServerError("Could not reach the server. Please check your connection and try again.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="bg-teal/10 border-2 border-teal rounded-stall p-6 text-center">
        <p className="font-display text-xl font-semibold text-teal-dark mb-2">Submission received</p>
        <p className="text-ink/70">Thanks for listing your business. An administrator will review it and let you know once it's approved and live in the directory.</p>
        <button onClick={function () { setSubmitted(false); }} className="mt-4 text-sm font-medium text-clay hover:text-clay-dark">Submit another business</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && <p className="text-sm text-clay-dark bg-clay/10 border border-clay/30 rounded-stall px-3 py-2">{serverError}</p>}

      <Field label="Business name" name="name" error={errors.name}>
        <input id="name" name="name" type="text" value={values.name} onChange={handleChange} className={inputClass(errors.name)} />
      </Field>

      <Field label="Category" name="category" error={errors.category}>
        <select id="category" name="category" value={values.category} onChange={handleChange} className={inputClass(errors.category)}>
          <option value="">Select a category</option>
          {categories.map(function (c) {
            return <option key={c.id} value={c.id}>{c.name}</option>;
          })}
        </select>
      </Field>

      <Field label="Short description" name="shortDescription" error={errors.shortDescription} hint="One sentence — this shows on your listing card.">
        <input id="shortDescription" name="shortDescription" type="text" maxLength={120} value={values.shortDescription} onChange={handleChange} className={inputClass(errors.shortDescription)} />
      </Field>

      <Field label="Full description" name="description" hint="Optional — add more detail for your business page.">
        <textarea id="description" name="description" rows={4} value={values.description} onChange={handleChange} className={inputClass()} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone number" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" placeholder="011 555 0198" value={values.phone} onChange={handleChange} className={inputClass(errors.phone)} />
        </Field>

        <Field label="Email address" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} className={inputClass(errors.email)} />
        </Field>
      </div>

      <Field label="Website (optional)" name="website">
        <input id="website" name="website" type="url" placeholder="https://" value={values.website} onChange={handleChange} className={inputClass()} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Area / suburb" name="area" error={errors.area}>
          <input id="area" name="area" type="text" value={values.area} onChange={handleChange} className={inputClass(errors.area)} />
        </Field>

        <Field label="Province" name="province">
          <input id="province" name="province" type="text" value={values.province} onChange={handleChange} className={inputClass()} />
        </Field>
      </div>

      <Field label="Street address (optional)" name="address">
        <input id="address" name="address" type="text" value={values.address} onChange={handleChange} className={inputClass()} />
      </Field>

      <button type="submit" disabled={submitting} className="w-full px-5 py-3 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors disabled:opacity-60">
        {submitting ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}

function Field(props) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">{props.label}</label>
      {props.children}
      {props.hint && !props.error && <p className="text-xs text-ink/50 mt-1">{props.hint}</p>}
      {props.error && <p className="text-xs text-clay-dark mt-1">{props.error}</p>}
    </div>
  );
}

function inputClass(error) {
  return "w-full px-3 py-2 border rounded-stall bg-white focus:outline-none focus:border-clay " + (error ? "border-clay-dark" : "border-line");
    }
