import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const books = [
  { id: 'tomorrow', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Fiction', year: 2022, rating: '4.8', color: 'coral', cover: 'Tomorrow\\n& Tomorrow', initials: 'GZ', description: 'A moving story about friendship, creativity, and the worlds we build together.' },
  { id: 'educated', title: 'Educated', author: 'Tara Westover', genre: 'Biography', year: 2018, rating: '4.7', color: 'sage', cover: 'EDUCATED', initials: 'TW', description: 'A remarkable memoir about the transformative power of education and the strength to shape your own life.' },
  { id: 'atlas', title: 'The Atlas of Small Things', author: 'Mira Solis', genre: 'Fiction', year: 2025, rating: '4.9', color: 'lavender', cover: 'THE ATLAS\\nOF SMALL THINGS', initials: 'MS', description: 'A lyrical, hopeful novel about the quiet ways we find our way home.' },
  { id: 'design', title: 'The Creative Act', author: 'Rick Rubin', genre: 'Art & Design', year: 2023, rating: '4.6', color: 'ochre', cover: 'THE\\nCREATIVE\\nACT', initials: 'RR', description: 'A beautiful guide to creativity as a way of being in the world.' },
  { id: 'wild', title: 'Wildwood: A Field Guide', author: 'Rowan Ellis', genre: 'Nature', year: 2024, rating: '4.8', color: 'forest', cover: 'WILDWOOD', initials: 'RE', description: 'Explore the hidden ecosystems and extraordinary lives of forests around the world.' },
  { id: 'tom-lake', title: 'Tom Lake', author: 'Ann Patchett', genre: 'Fiction', year: 2023, rating: '4.5', color: 'blue', cover: 'TOM LAKE', initials: 'AP', description: 'A warm reflection on love, family, and the stories we tell about our past.' },
  { id: 'quiet', title: 'The Quiet World', author: 'Mina Park', genre: 'Wellbeing', year: 2025, rating: '4.7', color: 'peach', cover: 'THE QUIET\\nWORLD', initials: 'MP', description: 'Small, practical rituals for finding a little more calm in a busy life.' },
  { id: 'moon', title: 'A Map of the Moon', author: 'Elliot James', genre: 'Science', year: 2024, rating: '4.6', color: 'night', cover: 'A MAP OF\\nTHE MOON', initials: 'EJ', description: 'A friendly illustrated tour through the mysteries of our nearest celestial neighbor.' },
];

const categories = ['All books', 'Fiction', 'Biography', 'Art & Design', 'Nature', 'Wellbeing', 'Science'];
const eventList = [
  { date: '24', month: 'OCT', title: 'Saturday story circle', time: 'Sat, Oct 24 · 10:30 AM', type: 'For little readers', icon: '✳' },
  { date: '28', month: 'OCT', title: 'Writing your own story', time: 'Wed, Oct 28 · 6:00 PM', type: 'Workshop · All levels', icon: '✎' },
  { date: '01', month: 'NOV', title: 'The Sunday book club', time: 'Sun, Nov 1 · 11:00 AM', type: 'Monthly gathering', icon: '◉' },
];

function BookCard({ book, borrowed, onBorrow, onDetails }) {
  return (
    <article className="book-card">
      <button className={`book-cover cover-${book.color}`} onClick={() => onDetails(book)} aria-label={`View details for ${book.title}`}>
        <span className="cover-stamp">{book.genre}</span>
        <span className="cover-title">{book.cover.split('\n').map((line) => <span key={line}>{line}</span>)}</span>
        <span className="cover-author">{book.author.toUpperCase()}</span>
        <span className="cover-mark">✳</span>
      </button>
      <div className="book-info">
        <div className="book-meta"><span>{book.genre}</span><span className="rating">★ {book.rating}</span></div>
        <button className="book-title" onClick={() => onDetails(book)}>{book.title}</button>
        <p className="book-author">by {book.author}</p>
        <button className={`borrow-button ${borrowed ? 'is-borrowed' : ''}`} onClick={() => onBorrow(book)}>
          {borrowed ? <><span>✓</span> Borrowed</> : <>Borrow this book <span>→</span></>}
        </button>
      </div>
    </article>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All books');
  const [borrowed, setBorrowed] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bright-future-borrowed') || '[]');
      return Array.isArray(saved) ? saved.filter((id) => books.some((book) => book.id === id)) : [];
    } catch (error) {
      console.warn('Could not read saved borrowed books; starting with an empty list.', error);
      return [];
    }
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [toast, setToast] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('bright-future-borrowed', JSON.stringify(borrowed));
    } catch (error) {
      console.error('Could not save borrowed books to browser storage.', error);
      setToast('Your books could not be saved in this browser. Check your storage settings.');
    }
  }, [borrowed]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleBooks = useMemo(() => books.filter((book) => {
    const matchesCategory = category === 'All books' || book.genre === category;
    const searchText = `${book.title} ${book.author} ${book.genre}`.toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  }), [category, query]);

  function borrowBook(book) {
    if (borrowed.includes(book.id)) {
      setBorrowed((current) => current.filter((id) => id !== book.id));
      setToast(`“${book.title}” returned. Thanks for sharing!`);
      return;
    }
    if (borrowed.length >= 5) {
      setToast('You have reached the 5-book borrowing limit. Return a book to borrow another.');
      return;
    }
    setBorrowed((current) => [...current, book.id]);
    setToast(`“${book.title}” added to your borrowed books.`);
  }

  function registerForEvent(title) {
    setRegisteredEvents((current) => current.includes(title) ? current : [...current, title]);
    setToast(`You're on the list for ${title}! See you there.`);
  }

  function showCatalog() {
    setCategory('All books');
    document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Bright Future Library home">
          <span className="brand-icon"><span>✳</span></span>
          <span className="brand-name">bright future<small>COMMUNITY LIBRARY</small></span>
        </a>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen}>☰</button>
        <nav className={`site-nav ${mobileMenuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <a className="nav-current" href="#catalog" onClick={() => setMobileMenuOpen(false)}>Explore books</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>Our library</a>
          <a className="my-books-link" href="#my-books" onClick={() => setMobileMenuOpen(false)}>My books <span>{borrowed.length}</span></a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
        <a className="header-join" href="#membership">Become a member <span>↗</span></a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow"><span></span> YOUR NEIGHBORHOOD, A WORLD OF STORIES</p>
            <h1>Find a little<br />wonder <em>between</em><br />the pages.</h1>
            <p className="hero-copy">Good books, good people, and room to grow. Your next favorite story is waiting right here.</p>
            <div className="hero-buttons"><button className="primary-button" onClick={showCatalog}>Find your next read <span>→</span></button><a className="text-link" href="#about">Get to know us <span>↗</span></a></div>
            <div className="hero-note"><div className="reader-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><p><strong>A good place to belong.</strong><br />Join 1,200+ curious readers in our community.</p></div>
          </div>
          <div className="hero-art" aria-label="Illustration of a cozy library reading nook">
            <div className="sun-disc"></div><span className="art-sparkle sparkle-one">✳</span><span className="art-sparkle sparkle-two">✦</span>
            <div className="art-window"><div className="window-cross"></div><div className="window-plant">♧</div></div>
            <div className="art-bookshelf"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div className="reading-chair"><div className="chair-back"></div><div className="chair-seat"></div><div className="chair-leg left"></div><div className="chair-leg right"></div><div className="chair-cushion"></div></div>
            <div className="side-table"><div className="table-top"></div><div className="table-leg"></div><div className="tiny-book"></div></div>
            <div className="art-rug"></div><div className="art-plant"><i></i><i></i><i></i><i></i><span></span></div>
            <div className="art-caption"><span className="caption-flower">✿</span><div><strong>Slow down. Settle in.</strong><small>There’s a seat for you here.</small></div></div>
          </div>
          <div className="hero-bottom-note"><span>01 — 03</span><span className="note-line"></span><span>MADE FOR EVERY KIND OF CURIOUS</span></div>
        </section>

        <section className="services-section section-wrap" id="services">
          <div className="section-heading services-heading">
            <div><p className="eyebrow">HERE FOR YOUR NEXT CHAPTER</p><h2>A library for<br />every kind of day.</h2></div>
            <p className="section-intro">More than books on a shelf. Find the tools, people, and welcoming spaces to help you learn and belong.</p>
          </div>
          <div className="services-grid">
            <article className="service-card"><span className="service-icon">▤</span><p>01 / THE COLLECTION</p><h3>Borrow & discover</h3><span>Explore books for every age, interest, and curious mind. Your library card is always free.</span><a href="#catalog">Browse the shelves <b>→</b></a></article>
            <article className="service-card"><span className="service-icon">⌘</span><p>02 / DIGITAL ACCESS</p><h3>Learn from anywhere</h3><span>Use library computers and free Wi-Fi, or ask our team for help with digital resources.</span><a href="#contact">Ask us how <b>→</b></a></article>
            <article className="service-card"><span className="service-icon">✳</span><p>03 / COMMUNITY</p><h3>Make something together</h3><span>Join a book club, bring little readers to story time, or share an idea for a new event.</span><a href="#events">See what’s on <b>→</b></a></article>
            <article className="service-card"><span className="service-icon">⌂</span><p>04 / A PLACE TO BE</p><h3>Settle in & stay awhile</h3><span>Find a quiet reading nook, a friendly face, and space to study or simply slow down.</span><a href="#about">Meet your library <b>→</b></a></article>
          </div>
        </section>

        <section className="catalog-section section-wrap" id="catalog">
          <div className="section-heading">
            <div><p className="eyebrow">A SHELF FULL OF POSSIBILITIES</p><h2>Stories worth<br className="mobile-break" /> staying in for.</h2></div>
            <p className="section-intro">From page-turners to thought-starters, explore books picked with our community in mind.</p>
          </div>
          <div className="catalog-toolbar">
            <div className="category-list" role="group" aria-label="Filter by book category">
              {categories.map((item) => <button key={item} className={`category-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Find a book or author..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search books by title, author or category" /><kbd>↵</kbd></label>
          </div>
          <div className="catalog-subhead"><p>{query || category !== 'All books' ? <><strong>{visibleBooks.length}</strong> books found</> : <>A few we think you’ll love <span>✳</span></>}</p><button className="sort-button" onClick={() => { setCategory('All books'); setQuery(''); }}>Reset filters <span>↺</span></button></div>
          {visibleBooks.length ? <div className="book-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} borrowed={borrowed.includes(book.id)} onBorrow={borrowBook} onDetails={setSelectedBook} />)}</div> : <div className="empty-state"><span>⌕</span><h3>No books found just yet.</h3><p>Try a different title, author, or category.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All books'); }}>Clear your search ↗</button></div>}
        </section>

        <section className="featured-section">
          <div className="featured-inner">
            <div className="featured-cover-wrap"><button className="featured-cover cover-lavender" onClick={() => setSelectedBook(books[2])} aria-label="View details for The Atlas of Small Things"><span className="cover-stamp">A BRIGHT FUTURE PICK</span><span className="cover-title"><span>THE ATLAS</span><span>OF SMALL</span><span>THINGS</span></span><span className="cover-author">MIRA SOLIS</span><span className="cover-mark">✳</span></button><span className="featured-sticker">✳<small>STAFF<br />FAVORITE</small></span></div>
            <div className="featured-copy"><p className="eyebrow">PICKED WITH LOVE, JUST FOR YOU</p><h2>One book can<br />change your <em>whole day.</em></h2><p>“The Atlas of Small Things” is a tender, hopeful story about the unexpected places that make us feel at home. The kind of book you’ll want to pass along.</p><div className="featured-byline"><span className="author-avatar">MS</span><span><strong>Mira Solis</strong><small>Fiction · 2025 · ★ 4.9 reader rating</small></span></div><div className="featured-actions"><button className="primary-button" onClick={() => borrowBook(books[2])}>{borrowed.includes(books[2].id) ? 'Return this book' : 'Borrow this book'} <span>→</span></button><button className="text-link" onClick={() => setSelectedBook(books[2])}>Read about the book <span>↗</span></button></div></div>
          </div>
        </section>

        <section className="community-band" id="about">
          <div className="community-inner">
            <div className="community-mark">✳</div>
            <div className="community-copy"><p className="eyebrow">MORE THAN A PLACE TO BORROW BOOKS</p><h2>Room to read.<br /><em>Room to grow.</em></h2><p><strong>Our mission is to make reading, learning, and belonging accessible to everyone.</strong> We bring neighbors together through stories, shared knowledge, and welcoming spaces for all ages. Come for a book, stay for the people, the ideas, and the feeling of being right where you belong.</p><a href="#membership" className="light-link">A little more about us <span>↗</span></a></div>
            <div className="community-stats"><div><strong>12k<span>+</span></strong><small>stories on our shelves</small></div><div><strong>1.2k</strong><small>neighbors who read with us</small></div><div><strong>36</strong><small>years in this community</small></div></div>
            <span className="community-flower">✿</span>
          </div>
        </section>

        <section className="events-section section-wrap" id="events">
          <div className="section-heading event-heading">
            <div><p className="eyebrow">GOOD THINGS HAPPEN HERE</p><h2>Come for the books.<br />Stay for the <em>people.</em></h2></div>
            <p className="section-intro">Book clubs, creative afternoons, and tiny readers with big imaginations. There’s always something lovely on.</p>
          </div>
          <div className="event-grid">{eventList.map((event) => {
            const registered = registeredEvents.includes(event.title);
            return <article className="event-card" key={event.title}><div className="event-top"><div className="event-date"><strong>{event.date}</strong><span>{event.month}</span></div><span className="event-icon">{event.icon}</span></div><p className="event-type">{event.type}</p><h3>{event.title}</h3><div className="event-footer"><span>{event.time}</span><button onClick={() => registerForEvent(event.title)} aria-label={`${registered ? 'Registered for' : 'Register for'} ${event.title}`}>{registered ? 'You’re in ✓' : 'Save me a seat ↗'}</button></div></article>;
          })}</div>
          <div className="events-cta"><span>Something on your mind? We’d love to hear it.</span><a href="mailto:hello@brightfuturelibrary.org">Suggest an event <span>↗</span></a></div>
        </section>

        <section className="membership-section" id="membership">
          <div className="membership-inner"><div className="membership-icon">✳</div><p className="eyebrow">YOUR LIBRARY CARD IS CALLING</p><h2>Make room for<br /><em>more wonder.</em></h2><p>Membership is free, and it comes with a whole lot of good. Drop by, say hello, and we’ll get you started.</p><a href="mailto:hello@brightfuturelibrary.org?subject=Library%20membership" className="primary-button">Join the library <span>→</span></a><small>Free for everyone. Always.</small></div>
        </section>

        <section className="loans-section section-wrap" id="my-books">
          <div className="loans-panel"><div><p className="eyebrow">YOUR READING NOOK</p><h2>My borrowed books <span>{borrowed.length}</span></h2><p className="loans-copy">{borrowed.length ? 'Lovely choices. You can return a title whenever you’re ready for the next one.' : 'Your borrowed books will show up here. Find something you love on the shelves above.'}</p></div><div className="loan-list">{borrowed.length ? borrowed.map((id) => {
            const book = books.find((item) => item.id === id);
            return <div className="loan-item" key={book.id}><span className={`loan-swatch cover-${book.color}`}>{book.initials}</span><span><strong>{book.title}</strong><small>by {book.author} · 21-day loan</small></span><button onClick={() => borrowBook(book)}>Return</button></div>;
          }) : <a className="loan-browse" href="#catalog">Browse the catalog <span>→</span></a>}</div></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-inner">
            <div className="contact-copy"><p className="eyebrow">LET’S TALK BOOKS (OR ANYTHING)</p><h2>There’s always<br />a friendly face <em>here.</em></h2><p>Need a hand finding something? Curious about membership or an event? Send us a note or stop by. We’d love to see you.</p>
              <div className="contact-details"><div><span className="contact-icon">⌖</span><span><strong>Come visit</strong><small>18 Maple Street, Cedar Grove</small></span></div><div><span className="contact-icon">✆</span><span><strong>Give us a call</strong><small><a href="tel:+15550142026">(555) 014-2026</a></small></span></div><div><span className="contact-icon">✉</span><span><strong>Drop us a line</strong><small><a href="mailto:hello@brightfuturelibrary.org">hello@brightfuturelibrary.org</a></small></span></div><div><span className="contact-icon">◷</span><span><strong>We’re open</strong><small>Mon–Sat, 9:00 AM–6:00 PM</small></span></div></div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="brand footer-brand" href="#home"><span className="brand-icon"><span>✳</span></span><span className="brand-name">bright future<small>COMMUNITY LIBRARY</small></span></a><p>A little library. A lot of heart.</p><div className="footer-links"><a href="#catalog">Explore</a><a href="#events">Events</a><a href="#about">Our library</a><a href="mailto:hello@brightfuturelibrary.org">Get in touch</a></div></div><div className="footer-bottom"><span>© 2026 Bright Future Library. All readers welcome.</span><span>Made with care, for our community <i>✳</i></span></div></footer>

      {selectedBook && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedBook(null)}><section className="book-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedBook(null)} aria-label="Close book details">×</button><div className={`modal-cover cover-${selectedBook.color}`}><span className="cover-stamp">{selectedBook.genre}</span><span className="cover-title">{selectedBook.cover.split('\n').map((line) => <span key={line}>{line}</span>)}</span><span className="cover-author">{selectedBook.author.toUpperCase()}</span><span className="cover-mark">✳</span></div><div className="modal-content"><p className="eyebrow">A BRIGHT FUTURE PICK · ★ {selectedBook.rating}</p><h2 id="modal-title">{selectedBook.title}</h2><p className="modal-author">by {selectedBook.author} · {selectedBook.year}</p><p>{selectedBook.description}</p><p className="modal-note">Available to borrow for 21 days. Return it to any desk when you’re done.</p><button className="primary-button" onClick={() => { borrowBook(selectedBook); setSelectedBook(null); }}>{borrowed.includes(selectedBook.id) ? 'Return this book' : 'Borrow this book'} <span>→</span></button></div></section></div>}

      {toast && <div className="toast-message" role="status"><span>✳</span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification">×</button></div>}
    </>
  );
}

function ContactForm() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus('Thanks for reaching out! This demo does not send messages yet. Email hello@brightfuturelibrary.org to reach our team.');
    form.reset();
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <p className="eyebrow">SEND A LITTLE NOTE</p>
      <h3>How can we help?</h3>
      <label htmlFor="contact-name">Your name</label>
      <input id="contact-name" name="name" type="text" placeholder="e.g. Jamie Reader" autoComplete="name" required minLength={2} />
      <label htmlFor="contact-email">Email address</label>
      <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      <label htmlFor="contact-message">Your message</label>
      <textarea id="contact-message" name="message" placeholder="Tell us what’s on your mind..." required minLength={10} rows={4}></textarea>
      <button className="primary-button" type="submit">Send your message <span>→</span></button>
      <p className="form-hint">All fields are required. Please include at least 10 characters in your message.</p>
      {status && <p className="form-success" role="status">{status}</p>}
    </form>
  );
}

createRoot(document.getElementById('root')).render(<App />);
