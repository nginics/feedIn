# [FeedIn](https://feedin.netlify.app/)

[FeedIn](https://feedin.netlify.app/) is a simple web application for receiving anonymous feedback. I created this website out of curiosity to explore how credential-based login systems function in [NextAuth.js](https://next-auth.js.org/) and how it operates behind the scenes.

---

## Features

- **Anonymous Feedback**: Users can provide feedback without revealing their identity.
- **Credential-Based Login**: Secured with [NextAuth.js](https://next-auth.js.org/) for authentication.
- **Email Notifications**: Sends email alerts using [Resend](https://resend.com/).
- **Responsive UI**: Built with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://shadcn.dev/) for a modern design.
- **Data Persistence**: User data and feedback messages is stored in a [MongoDB](https://www.mongodb.com/) database using [Mongoose](https://mongoosejs.com/).

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://shadcn.dev/).
- **Backend**: [Next.js API routes](https://nextjs.org/docs/api-routes/introduction).
- **Database**: [MongoDB](https://www.mongodb.com/), with [Mongoose](https://mongoosejs.com/) for object modeling.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) for secure login.
- **Email Notifications**: [Resend](https://resend.com/).

---

## Prerequisites

Before setting up the project, ensure you have the following:

- Node.js (>=16.x)
- Next.js (>=15.x)
- Zod (>=3.x)
- React Hook Form (>=7.x)
---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/feedin.git
   cd feedin
