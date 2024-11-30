import { COLORS } from "../../constants/color";

export const categoriesItemColumns = [
  {
    accessorKey: "category_id",
    header: "ID",
    show: false,
  },
  {
    accessorKey: "category_name",
    header: "Name",
  },
  {
    accessorKey: "number_of_items",
    header: "Number of Items",
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
];

export const inventoryColumns = [
  {
    accessorKey: "inventory_id",
    header: "ID",
    show: false,
  },
  {
    accessorKey: "item_id",
    header: "Item ID",
    show: false,
  },
  {
    accessorKey: "item_name",
    header: "Name",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: "700", color: COLORS.secondary }}>
        {cell.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "isStatus",
    header: "Status",
    //or in the component override callbacks like this
    Cell: ({ cell, row }) => (
      <div>
        {row.original.isStatus ? (
          <span style={{ color: "#388b84", textTransform: "capitalize" }}>
            In Stock
          </span>
        ) : (
          <span style={{ color: "#fd4332", textTransform: "capitalize" }}>
            Out of Stock
          </span>
        )}
      </div>
    ),
  },
];
