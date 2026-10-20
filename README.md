# Bright Future Library

A responsive community-library website built with React functional components, JSX, and CSS.

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`.

## Features

- Search books by title, author, or category; filter by genre.
- Open book details, borrow and return books, and view your borrowed titles.
- Borrowing state is saved in local browser storage, with a five-book limit.
- Review upcoming events and register for a seat with an in-page confirmation.
- Browse library services, read the library mission, and view contact details.
- Submit the contact form with required name, valid email, and a minimum-length message validation.
- Responsive navigation and layouts for mobile and desktop.

The catalog, events, and contact details are sample content and are not connected to a library database. Borrowed books are saved in browser storage. Contact form submissions are validated in the browser but are not sent to a server; use the displayed email address to contact the library.