export const storeColumns = [
  {
    accessorKey: "id",
    header: "ID",
    show: false, // Custom property to hide this column
  },
  {
    accessorKey: "store_name",
    header: "Store Name",
  },
  {
    accessorKey: "store_no",
    header: "Store No",
  },
  {
    accessorKey: "address",
    header: "Location",
    Cell: ({ row }) => {
      const {
        address_line1,
        address_line2,
        province,
        city,
        country,
        postal_code,
      } = row.original;
      // Combine address fields into a single string
      const address = [
        address_line1,
        address_line2,
        province,
        city,
        country,
        postal_code,
      ]
        .filter(Boolean) // Remove any empty fields
        .join(", ");
      return <span>{address}</span>;
    },
  },
  {
    accessorKey: "store_contact",
    header: "Store Contact",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    Cell: ({ cell, row }) => {
      const date = new Date(row.original.date_created);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(date);
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "isStatus",
    header: "Status",
    Cell: ({ cell, row }) => (
      <span
        style={{
          color: row.original.isStatus === 1 ? "#388b84" : "#fd4332",
          textTransform: "capitalize",
        }}
      >
        {row.original.isStatus === 1 ? "Open" : "Closed"}
      </span>
    ),
  },
];
