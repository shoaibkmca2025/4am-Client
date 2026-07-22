# 4AM Global Media — Platform User Guide

A plain-language guide to running the 4AM Global Media platform: issuing
certificates, handling enquiries, publishing articles, hiring, and more.
No technical knowledge needed.

> **Who this is for:** the 4AM team (admins and staff). Students and the
> public only ever see the parts described in sections 9 and 10.

---

## 1. The three types of user

| Role | Who | Can do |
|------|-----|--------|
| **Admin** | Founders / owners | Everything, including the Activity log |
| **Staff** | Team members | Courses, certificates, enquiries, articles, careers, testimonials |
| **Student** | Workshop attendees | Claim and download **their own** certificate only |

Everyone who signs up is a **student** by default. Admin/staff access is
granted deliberately (see section 2) — nobody can promote themselves.

---

## 2. Getting access (first-time setup)

1. Go to **`https://4amglobalmedia.com/portal`** and create an account with
   your email and a password.
2. Ask whoever manages the Supabase database to run this once, replacing the
   email with yours (Supabase dashboard → SQL Editor):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@4amglobalmedia.com');
   ```
   Use `'staff'` instead of `'admin'` for team members who shouldn't see the
   Activity log or manage other things admin-only.
3. Sign in at **`https://4amglobalmedia.com/admin`**. You'll land on the
   dashboard.

---

## 3. The admin dashboard at a glance

Open **`/admin`**. Across the top is a **metrics strip** — courses,
students, certificates issued, claimed ratio, new enquiries, subscribers.

Below it are tabs:

- **Courses & certificates** — the certificate system (section 4)
- **Enquiries** — messages from the website contact form (section 6)
- **Articles** — the blog / CMS (section 7)
- **Careers** — job openings and applications (section 8)
- **Testimonials** — client quotes shown on the homepage (section 5)
- **Activity log** — *(admins only)* a record of who did what

---

## 4. Certificates — the core workflow

The full journey: **you issue → the student claims → anyone can verify.**

### 4a. Create a course / batch
1. **Courses & certificates** tab → **New course**.
2. Enter the course title, and optionally the college/client and venue.
3. Click **Create course**. It appears in the list on the left.

### 4b. Add a student and get their claim key
1. Select the course, then fill in the student's **name and email**.
2. Click **Add student & generate key**.
3. A **claim key** appears — like `4AM-7K9X2-M3PQR`.

   ⚠️ **This key is shown once and can never be recovered.** Copy it (there's
   a Copy button) and give it to that student. It's how they prove the
   certificate is theirs. If you lose it, you'll have to remove and re-add
   the student to generate a new one.

### 4c. Add many students at once (CSV import)
1. Prepare a spreadsheet with two columns: **name** and **email**. Save it as
   a `.csv` file. A header row is fine. Up to 500 students per file.
2. Select the course → click **or import CSV** → choose your file.
3. Every student is added and a table of **all their claim keys** appears.
   Click **Download keys as CSV** to save them — again, this is your only
   chance to capture the keys.
4. Rows that are invalid (bad email) or already enrolled are listed as
   "skipped" so you know exactly what happened.

### 4d. Issue the certificate
1. Find the student in the roster → click **Issue certificate**.
2. Choose their certificate file (PDF or image).
3. The system creates a unique **serial** (like `4AM-2026-A7K3M2`), a
   security signature, and a **QR code** that links to the verification page.
   The QR is generated automatically — print it on the certificate if you like.

### 4e. Revoke or re-issue
- **Revoke** (if a certificate was issued in error): click **Revoke**, enter
  a reason. The public verify page will then show "Revoked" with that reason,
  and the student can no longer download it.
- **Re-issue** (e.g. corrected file): generates a fresh serial; the old
  serial stops verifying.

Everything here is recorded in the Activity log.

---

## 5. Testimonials (homepage client quotes)

The homepage shows a rotating carousel of client quotes. Out of the box it
shows three built-in examples. **The moment you publish your own, they take
over** — and if you ever unpublish them all, it falls back to the built-ins,
so the section is never empty.

1. **Testimonials** tab → fill in client name, company/role, and the quote.
2. **Save draft** (nothing appears on the site yet).
3. Click **Publish** on the ones you want live. They appear on the homepage
   within a few minutes.
4. Use **Unpublish** to hide one, **Delete** to remove it permanently.

---

## 6. Enquiries (website contact form)

Every message sent through the website's **Contact** form lands in the
**Enquiries** tab — stored safely in your database.

- Filter by **New / Contacted / Closed**.
- Click a person's email or phone to reply directly.
- Use **Mark contacted / Mark closed** to track where each lead stands.

**Email & chat alerts (optional):** if the technical setup includes a Resend
key and/or a Slack/WhatsApp webhook, you'll also get a notification the moment
an enquiry arrives. Even without those, every enquiry is safely saved here —
you'll never lose one.

---

## 7. Articles (blog / CMS)

Published articles appear at **`https://4amglobalmedia.com/blog`** and are
built for Google — proper titles, previews, and search-friendly pages.

1. **Articles** tab → **New article**.
2. Enter a title (the web address fills in automatically), an excerpt (the
   short summary shown in listings), tags, and the body.
3. **Formatting** in the body uses simple marks:
   - `## Heading` for a section heading
   - `**bold**` and `*italic*`
   - `[link text](https://example.com)` for links
   - `` `code` `` for inline code
   - `- item` at the start of a line for bullet points
4. **Save draft**, then **Publish** when ready. Use **View** to see it live.

The reading time ("3 min read") is calculated for you.

---

## 8. Careers (hiring)

Open roles appear at **`https://4amglobalmedia.com/careers`**, each with an
application form that accepts a résumé.

### Posting a role
1. **Careers** tab → **New opening**: role title, department, location.
2. **Create draft**, then **Publish** to make it live. Use **Close** when the
   role is filled (**Reopen** brings it back).

### Reviewing applicants
- Each application shows the candidate's details, cover note, portfolio link,
  and a **Résumé** button (a secure, temporary download link).
- Move each candidate through the pipeline: **new → reviewing → shortlisted →
  rejected / hired**.

---

## 9. What students experience

Students use **`https://4amglobalmedia.com/portal`**:

1. They register / sign in.
2. They enter the **claim key** you gave them.
3. Their certificate appears — they can **Download** it (a secure link) and
   see its public verification page.

A key works **only once**. If someone tries a used key, they're told it's
already been claimed; a wrong key tells them to check for typos.

---

## 10. What the public experiences

Anyone — an employer, a college — can confirm a certificate is genuine:

- They visit **`https://4amglobalmedia.com/verify/{serial}`** or scan the QR
  code on the certificate. **No login needed.**
- They instantly see the holder's name, course, issue date, "4AM Global
  Media" as issuer, and a **Verified — Genuine** badge (or **Revoked**, with
  the reason, if it was revoked).
- The page can't be faked by editing the serial — the security signature is
  checked on our side.

---

## 11. Newsletter

The website footer has a small **Newsletter** field. When a visitor
subscribes, their email is saved to your subscriber list (visible to the
technical team in the database). Unsubscribes are handled automatically.

---

## 12. Quick reference — addresses

| Page | Address | Who |
|------|---------|-----|
| Admin dashboard | `/admin` | Admin / staff |
| Student portal | `/portal` | Students |
| Verify a certificate | `/verify/{serial}` | Anyone |
| Blog | `/blog` | Anyone |
| Careers | `/careers` | Anyone |

---

## 13. Common questions

**A student lost their claim key. What now?**
Keys can't be recovered (they're stored encrypted for security). In the
roster, the safest fix is to add the student again to generate a fresh key,
then issue against the new enrolment.

**I published a testimonial / article but don't see it on the site.**
Give it a few minutes — public pages are cached briefly for speed. A hard
refresh (Ctrl+Shift+R) usually shows it immediately.

**Someone signed up but can't see the admin panel.**
That's expected — everyone starts as a student. Grant them staff/admin access
using the SQL in section 2.

**Is a revoked certificate still downloadable?**
No. Revoking immediately blocks the student's download and flips the public
page to "Revoked".

---

*For technical setup (environment variables, database migrations,
deployment), see `README`, `db/README.md`, and `.env.example`.*
