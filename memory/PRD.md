# PRD — Cyberpunk Game Design Portfolio

## Original Problem Statement
I am a game design student in need of a portfolio. I have content that I would like to be able to just plug in without guesswork. Build me a game design portfolio with a cyberpunk vibe (my favorite game genre). There should be 4 core sections: Home/About, Projects, Resume, and Contact. Under Projects, I should be able to create subcategories for the different projects I have worked on (which I will input later).

## User Choices
- Content editing: a basic in-site dashboard to add/edit content
- Contact section: both links and a contact form
- Resume section: both on-page resume and PDF button
- Projects structure: both filters and grouped sections

## Architecture Decisions
- Frontend: React app with route-based portfolio pages and a dedicated Studio dashboard route
- Backend: FastAPI API serving portfolio content and contact messages
- Database: MongoDB singleton portfolio document + contact messages collection
- State flow: frontend loads portfolio data from backend and saves edits back through the Studio
- Visual direction: dark electric-neon cyberpunk styling with strong typography, motion, and cinematic imagery

## User Personas
- Game design student needing a polished portfolio quickly
- Recruiter or hiring manager scanning projects, resume, and contact details
- Mentor/collaborator reviewing work samples and reaching out through the contact form

## Core Requirements
- Cyberpunk-themed portfolio experience
- Four main sections: Home/About, Projects, Resume, Contact
- Projects page supports subcategories
- Resume available both on-page and through PDF button
- Contact area includes direct links and message form
- Content should be easy to edit later without guesswork

## What's Been Implemented
### 2026-04-10
- Built a cyberpunk portfolio frontend with routes for Home/About, Projects, Resume, Contact, and Studio
- Added grouped + filterable Projects experience powered by editable project categories
- Added Resume page with sticky summary/skills layout and PDF download button
- Added Contact page with direct links and a working message form
- Built Studio dashboard to edit hero/about content, project categories, projects, resume entries, contact details, and review inbox messages
- Built FastAPI + MongoDB backend endpoints for portfolio content load/save and contact submission storage
- Added backend regression tests for portfolio/contact APIs

## Prioritized Backlog
### P0
- Optional: add protected access to the Studio route so public visitors cannot edit content

### P1
- Split the Studio page into smaller components/hooks for maintainability
- Add dedicated case-study pages for individual projects
- Add richer project media fields like gallery images or embedded gameplay clips

### P2
- Add downloadable resume upload management instead of pasting a PDF URL
- Add analytics or lead source notes for contact submissions
- Add optional testimonials or featured collaborators section

## Features Remaining
- P0 remaining: Studio access control
- P1 remaining: deeper project storytelling and Studio refactor
- P2 remaining: richer media management and portfolio growth features

## Next Tasks List
- Add project detail/case-study pages linked from each project card
- Protect the Studio with a simple login or passcode flow
- Break Studio into smaller reusable editor components
- Expand content schema for galleries, videos, and extra recruiter-facing metadata
