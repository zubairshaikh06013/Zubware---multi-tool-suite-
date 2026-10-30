# Age calculator search presentation

## 29 October 2026: description experiment

Scope: `/age-calculator`, an English tool for a global audience. Keep the
canonical URL, current title, H1, date calculation, and existing guides stable.
The description and shared opening text now state the input, output, instant
results, birthday countdown, free access, and absence of a signup requirement.
The calculator repeats the access and processing details next to its inputs.
This is a search-presentation hypothesis, not a proven CTR improvement.

The description flows from `src/data/toolsData.ts` into the prerendered HTML,
social metadata, structured data and client page. The about paragraph in
`src/lib/paths.ts` is shared by the generated HTML and client.

## 30 October 2026: explain age on a selected date

The primary query focus is "age calculator on date", with "age on a specific
date" as a natural variant on the existing canonical page. Add a personalised
calculation breakdown below the main result: the birth date, completed calendar
months and their anniversary, then the remaining days to the reference date.
Reuse the calculator's birth-anchored anniversary convention, including short
months and leap-day births. Do not describe it as consecutive year/month
additions, which can produce a different anchor after a February 29 birthday.
Invalid dates show no explanation. Dates stay in the browser.

This is a usability improvement, not a confirmed fix for a ranking drop. Keep
the title, H1, description and canonical stable for this change. Evaluate the
exact query with US/Desktop segmentation as well as the overall page; do not
publish private account metrics in this repository.

## Measurement procedure

Keep Search Console exports and actual account metrics private. For this page,
compare equivalent completed date windows and record the deployment date.
Segment by exact query, country, device and search type. Compare clicks,
impressions, CTR and average position together. Do not compare a mixed global
average with a single local manual search. A ranking or query-mix change can
change CTR independently of the description.

Before judging the experiment, check that Google has recrawled the changed
page, and observe the title and snippet actually shown in the target search.
Google can choose a different snippet from page content; a deployed meta
description is not proof of what users saw. A small sample with zero clicks
does not by itself establish a defective snippet. Avoid repeated copy changes
while collecting a comparable sample; make the next decision from the evidence.

## Validation

- Build the production site and run TypeScript and SEO regressions.
- Inspect `/age-calculator.html` for one description and the existing canonical,
  title and H1; verify social descriptions match the page description.
- Check the shared opening text in generated HTML and the client page.
- Recheck example, reference-date, birthday, Today and Reset controls when the
  live deployment is available.

## References

- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/appearance/title-link
- https://support.google.com/webmasters/answer/7576553
