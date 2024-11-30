import { v4 as uuidv4 } from "uuid";
let counter = 1;
let counters = 0;

export function generateTrackingCode() {
  const uuid = uuidv4().replace(/-/g, "").toUpperCase();

  return `#${uuid.substring(0, 20)}`;
}

export function generateTransactionId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const uniquePart = String(counter).padStart(4, "0");
  counter += 1;
  const transactionId = `LLH-${datePart}-${uniquePart}`;
  return transactionId;
}

export function generateBigIntCustomerId() {
  const now = new Date();

  const datePart =
    (now.getFullYear() % 100) * 100000000000 +
    (now.getMonth() + 1) * 1000000000 +
    now.getDate() * 10000000 +
    now.getHours() * 100000 +
    now.getMinutes() * 1000;

  const uniquePart = String(counters).padStart(3, "0");
  counter += 1;

  const customerId = `${datePart}${uniquePart}`;

  if (String(customerId).length > 20) {
    throw new Error("Generated ID exceeds 20 digits");
  }

  return customerId;
}

// export function generateBigIntCustomerId() {
//   const timestamp = Date.now();

//   // Combine with a counter to ensure uniqueness within the same millisecond
//   const uniquePart = String(counter).padStart(4, "0");
//   counter += 1;

//   // Generate a BIGINT by combining the timestamp with the counter
//   const customerId = BigInt(`${timestamp}${uniquePart}`);
//   return customerId;
// }

// export function generateBigIntCustomerId() {
//   const now = new Date();

//   const datePart =
//     (now.getFullYear() % 100) * 1000000 + // Last two digits of the year
//     (now.getMonth() + 1) * 10000 + // Month (1-12)
//     now.getDate() * 100 + // Day (1-31)
//     now.getHours() * 1; // Current hour (0-23)

//   const uniquePart = String(counters).padStart(4, "0");
//   counter += 1;

//   const customerId = datePart + Number(uniquePart);

//   if (String(customerId).length > 10) {
//     throw new Error("Generated ID exceeds 10 digits");
//   }

//   return customerId;
// }
