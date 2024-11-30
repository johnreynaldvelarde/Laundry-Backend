// export const storeColumns = [
//   {
//     accessorKey: "store_name", //access nested data with dot notation
//     header: "Store Name",
//   },
//   {
//     accessorKey: "store_no", //access nested data with dot notation
//     header: "Store No",
//   },
//   {
//     accessorKey: "location", //access nested data with dot notation
//     header: "Location",
//   },
//   {
//     accessorKey: "store_contact",
//     header: "Store Contact",
//   },
//   {
//     accessorKey: "available_unit",
//     header: "Avaialble Unit",
//   },
//   {
//     accessorKey: "staff",
//     header: "Staff",
//   },
//   {
//     accessorKey: "instatus",
//     header: "Status",
//     //or in the component override callbacks like this
//     Cell: ({ cell, row }) => (
//       <div>
//         {row.original.instatus ? (
//           <span style={{ color: "#388b84", textTransform: "capitalize" }}>
//             Open
//           </span>
//         ) : (
//           <span style={{ color: "#fd4332", textTransform: "capitalize" }}>
//             Closed
//           </span>
//         )}
//       </div>
//     ),
//   },
// ];

// export const storeColumns = [
//   { id: "store_id", label: "Store ID", minWidth: 100 },
//   { id: "store_name", label: "Store Name", minWidth: 150 },
//   { id: "store_address", label: "Store Address", minWidth: 200 },
//   { id: "store_contact", label: "Store Contact", minWidth: 150 },
//   { id: "is_main_store", label: "Main Store", minWidth: 100 },
//   { id: "updated_at", label: "Updated At", minWidth: 150 },
//   { id: "date_created", label: "Date Created", minWidth: 150 },
//   { id: "isStatus", label: "Status", minWidth: 100 },
//   { id: "isArchive", label: "Archive", minWidth: 100 },
// ];

// export const storeColumns = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     show: false,
//   },
//   {
//     accessorKey: "store_name", // Access nested data with dot notation if needed
//     header: "Store Name",
//   },
//   {
//     accessorKey: "store_conteac", // Access nested data with dot notation if needed
//     header: "Store No",
//   },
//   {
//     accessorKey: "location", // Access nested data with dot notation if needed
//     header: "Location",
//   },
//   {
//     accessorKey: "store_contact",
//     header: "Store Contact",
//   },
//   {
//     accessorKey: "available_unit",
//     header: "Available Unit", // Fixed typo here
//   },
//   {
//     accessorKey: "staff",
//     header: "Staff",
//   },
//   {
//     accessorKey: "instatus",
//     header: "Status",
//     Cell: ({ cell, row }) => (
//       <div>
//         {row.original.instatus ? (
//           <span style={{ color: "#388b84", textTransform: "capitalize" }}>
//             Open
//           </span>
//         ) : (
//           <span style={{ color: "#fd4332", textTransform: "capitalize" }}>
//             Closed
//           </span>
//         )}
//       </div>
//     ),
//   },
// ];
