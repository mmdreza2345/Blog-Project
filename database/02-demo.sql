SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO users (id, name, joined_at) VALUES (1, 'B-lock Editors', '2026-01-01');
INSERT INTO categories (id, name, image) VALUES (1, 'React', '/images/react.png');
INSERT INTO categories (id, name, image) VALUES (2, 'TypeScript', '/images/typescript.png');
INSERT INTO categories (id, name, image) VALUES (3, 'JavaScript', '/images/js.png');
INSERT INTO categories (id, name, image) VALUES (4, 'CSS', '/images/css.png');
INSERT INTO categories (id, name, image) VALUES (5, 'AI', '/images/ai.png');
INSERT INTO categories (id, name, image) VALUES (6, 'Next.js', '/images/nextjs.png');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('1', '1', '1', 'Building Modern UI with Next.js', 'A layout can keep the site navigation visible while a page supplies the article content. Give interactive controls their own client component so the rest of the layout can render on the server.

Try moving a shared header into the root layout. Navigate between two articles and check that the header remains in place.', 'Learn how to build scalable frontend applications.', '/images/react.png', 'Published', '2026-07-01', '2026-07-01', '8234', '421');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('2', '1', '2', 'Why Every React Developer Should Learn TypeScript', 'TypeScript can express which fields are available on a loaded article. A union such as Draft or Published makes it harder to pass an unsupported status to an editor.

Give the network response a type, then validate data where it enters the application. A type annotation alone does not validate JSON at runtime.', 'Improve code quality and catch bugs before runtime.', '/images/typescript.png', 'Published', '2026-06-28', '2026-06-28', '6541', '387');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('3', '1', '3', 'Understanding JavaScript Closures', 'A closure gives a function access to the variables in the scope where it was created. A click handler can remember an article ID even after the function that created the handler returns.

Loop over two article IDs with a block-scoped variable and create a handler for each. Call the handlers later and compare their results.', 'Master one of JavaScript''s most powerful concepts.', '/images/js.png', 'Published', '2026-06-22', '2026-06-22', '9472', '562');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('4', '1', '4', 'Modern CSS Tricks You Should Know', 'Use grid for the article list and flexbox for the actions on each card. A minimum card width lets the grid choose how many columns fit.

Test your layout with a long title, a missing image and a narrow screen. Those cases often reveal rigid height assumptions.', 'Level up your UI with modern CSS features.', '/images/css.png', 'Published', '2026-06-18', '2026-06-18', '7318', '298');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('5', '1', '5', 'Getting Started with Generative AI', 'Start with one small task, such as drafting a summary from a supplied article. Include the source text and tell the model what a good summary should preserve.

Review names, numbers and quotations against the source. Store the approved version alongside the original article.', 'An introduction to modern AI tools and LLMs.', '/images/ai.png', 'Published', '2026-06-12', '2026-06-12', '11235', '741');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('6', '1', '6', 'Mastering Next.js App Router', 'The App Router maps folders to URL segments. A dynamic segment gives each article a page while sharing the same component.

Separate the three states a reader can encounter: the article is loading, it does not exist, or the service could not be reached.', 'Learn how to build modern applications using the latest Next.js routing system.', '/images/500.webp', 'Published', '2026-06-10', '2026-06-10', '8342', '451');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('7', '1', '1', 'React Performance Optimization Techniques', 'Measure a slow interaction before adding memoization. A long article list might spend more time creating DOM nodes than computing the filter.

Use the React profiler to inspect a search. Compare an ordinary list with pagination using the same dataset and the same search term.', 'Improve your React applications with advanced optimization methods.', '/images/500 (1).webp', 'Published', '2026-06-08', '2026-06-08', '12045', '823');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('8', '1', '2', 'Advanced TypeScript Patterns', 'A discriminated union can describe an editor that is loading, ready or unavailable. Each state carries only the fields its view needs.

Switch on the state before reading the article. The compiler can then catch a new state that the editor does not handle.', 'Discover powerful TypeScript patterns for large-scale applications.', '/images/500 (2).webp', 'Published', '2026-06-05', '2026-06-05', '7643', '392');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('9', '1', '3', 'Understanding JavaScript Event Loop', 'JavaScript runs the current task to completion. Promise continuations queued during that task run as microtasks before the browser handles its next task.

Log one synchronous message, a resolved promise and a zero-delay timer. Predict the order, then compare it with the browser console.', 'A deep dive into asynchronous JavaScript and browser execution.', '/images/500 (3).webp', 'Published', '2026-06-02', '2026-06-02', '10321', '612');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('10', '1', '4', 'Modern Tailwind CSS Workflow', 'Start with the smallest screen and add breakpoints when the content needs more room. Use a small set of spacing and color choices across the form, toolbar and preview.

Check keyboard focus, disabled controls and readable line length. Reuse a component once several pages need the same interaction.', 'Create scalable designs faster with utility-first CSS.', '/images/500 (4).webp', 'Published', '2026-05-29', '2026-05-29', '6821', '341');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('11', '1', '5', 'Introduction to Large Language Models', 'Language models generate text by estimating likely continuations. Their output depends on the prompt, supplied context and sampling choices.

For an article assistant, keep a small set of representative requests and review the answers whenever the prompt or model changes.', 'Understand how modern AI models generate human-like text.', '/images/500 (5).webp', 'Published', '2026-05-25', '2026-05-25', '15643', '932');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('12', '1', '6', 'Building Production Ready Next.js Apps', 'Keep database access on the server and return only the fields the page uses. The browser can call a relative API path so the same code works across development machines.

Test a clean build and a fresh database together. A running development server can hide missing configuration or missing seed data.', 'Learn best practices for deploying professional web applications.', '/images/500 (6).webp', 'Published', '2026-05-20', '2026-05-20', '9214', '534');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('13', '1', '1', 'State Management in Modern React', 'Keep temporary input values inside the form and fetch persisted data from the service that owns it. This makes it clear when a draft is saved.

Derive totals from the current article list so the dashboard immediately reflects a deletion.', 'Compare different approaches for handling application state.', '/images/500 (7).webp', 'Published', '2026-05-16', '2026-05-16', '8745', '421');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('14', '1', '3', 'Modern ES Features Every Developer Should Know', 'Optional chaining helps when a nested value may be missing. Nullish coalescing supplies a default while preserving valid values such as zero.

Try the same expression with an empty string, zero, null and undefined. The differences matter for counters and optional profile fields.', 'Explore powerful JavaScript features that improve productivity.', '/images/500 (8).webp', 'Published', '2026-05-12', '2026-05-12', '5432', '287');
INSERT INTO articles (id, author_id, category_id, title, content, excerpt, image, status, created_at, published_at, views, likes) VALUES ('15', '1', '5', 'Creating AI Powered Web Applications', 'Add one model-assisted action to an existing workflow, such as suggesting article tags. Let the author review each suggestion before saving it.

Track failures as well as successful responses. Keep a manual path available when the external service is unavailable.', 'Learn how developers integrate AI features into websites.', '/images/500 (9).webp', 'Published', '2026-05-08', '2026-05-08', '13421', '812');
COMMIT;
