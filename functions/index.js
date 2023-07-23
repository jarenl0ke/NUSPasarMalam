const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

exports.deleteOutdatedRequests = functions.pubsub
    .schedule("every 24 hours") // Run the function every 24 hours
    .timeZone("Asia/Singapore")
    .onRun(async (context) => {
      const now = Date.now();
      const cutoff = now - THREE_DAYS_IN_MS;

      const requestsRef = admin.firestore().collection("Requests");
      const outdatedRequestsQuery =
      requestsRef.where("listingDateTime", "<", new Date(cutoff));

      const outdatedRequestsSnapshot = await outdatedRequestsQuery.get();
      const batch = admin.firestore().batch();

      outdatedRequestsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    });
