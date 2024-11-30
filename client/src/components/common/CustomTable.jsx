import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/color";
import OutlinedIconButton from "../table/OutlinedIconButton";
import { PencilLine, StackPlus, Trash } from "@phosphor-icons/react";

const CustomTable = ({
  data,
  fields,
  numberOfRows,
  enableTopToolBar,
  enableBottomToolBar,
  enablePagination,
  enableRowSelection,
  enableColumnFilters,
  enableEditing,
  enableColumnDragging,
  showPreview,
  routeLink,
}) => {
  // Filter out columns with show: false
  const columns = useMemo(
    () => fields.filter((column) => column.show !== false),
    [fields]
  );

  const [tableData, setTableData] = useState(() => data);

  const handleDeleteRow = useCallback(
    (row) => {
      if (!confirm("Are you sure you want to delete")) {
        return;
      }
      data.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData, data]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={tableData.slice(0, numberOfRows)}
      getRowId={(row) => row.id}
      enableEditing={enableEditing}
      enableColumnDragging={enableColumnDragging}
      enableColumnOrdering
      enableRowSelection={enableRowSelection}
      enableColumnFilters={enableColumnFilters}
      enablePagination={enablePagination}
      enableBottomToolbar={enableBottomToolBar}
      enableTopToolbar={enableTopToolBar}
      renderRowActions={({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Trash color={COLORS.error} weight="duotone" />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Edit">
            <Link to={`/${routeLink}/edit/${row.id}`}>
              <IconButton>
                <PencilLine color={COLORS.secondary} weight="duotone" />
              </IconButton>
            </Link>
          </Tooltip>
          {showPreview && routeLink && (
            <Tooltip arrow placement="right" title="Restock">
              <Link to={`/${routeLink}/${row.id}`}>
                <IconButton>
                  <StackPlus color={COLORS.success} weight="duotone" />
                </IconButton>
              </Link>
            </Tooltip>
          )}
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => (
        <Button
          disableElevation
          color="error"
          disabled={!table.getIsSomeRowsSelected()}
          variant="contained"
          // onClick={handleDelete}
          sx={{ textTransform: "none" }}
        >
          Delete Selected
        </Button>
      )}
      muiTableBodyRowProps={{ hover: false }}
      muiTablePaperProps={{
        sx: {
          padding: "20px",
          borderRadius: "15px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: COLORS.border,
          boxShadow: "none",
        },
      }}
      muiTableContainerProps={{
        sx: { borderRadius: "15px" },
      }}
      muiTableHeadCellProps={{
        sx: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      }}
      muiTableHeadProps={{
        sx: {
          "& tr th": {
            borderWidth: "1px",
            borderColor: "divider",
            borderStyle: "solid",
          },
        },
      }}
      muiTableBodyProps={{
        sx: {
          "& tr td": {
            borderWidth: "1px",
            borderColor: "divider",
            borderStyle: "solid",
          },
        },
      }}
    />
  );
};

export default CustomTable;
