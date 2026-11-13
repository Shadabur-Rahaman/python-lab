# Python Lab 4.0 test report

- Production frontend build passed. Vite reports a size warning for the PDF viewer, which loads when a PDF is opened.
- All 22 Node/Python test groups passed, including beginner identifier examples, existing course exercises and resource upload validation.
- All 17 Microsoft Edge tests passed on the initial 4.0 build, including a phone-width navigation test, inert text preview, Escape and focus restoration, and rejected sign-in. Library and auth scenarios use fixture responses.
- The live anonymous material endpoint returned HTTP 200 and the protected teacher profile returned HTTP 401 without a session.
- A production teacher account and authorized disposable materials are required to verify successful sign-in, email recovery and the complete upload-to-publish cycle. No production records were created for these tests.
