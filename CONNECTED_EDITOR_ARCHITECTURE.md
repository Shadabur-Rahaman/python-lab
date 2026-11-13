# Connected editor architecture

ReceiptEditor uses the existing CodeLab draft store under the stable receipt-workspace ID. Variables and Values and Playground mount the same document in separate routes. Existing chapter examples retain their original draft IDs. The original receipt starter is immutable. Reset confirms replacement when code or input differs. A named snippet is a separate snapshot. Loading a snippet is an explicit replacement of the current draft.

The latest saved edit wins for a shared document on this browser. There is no cross-device synchronization. The runtime and output belong to the mounted editor, and Python starts on the first Run. Lesson stage is saved independently of code and of course mastery.
