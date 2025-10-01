import { Person } from "@/models";
import { removeFavorite } from "@/redux/states";
import { AppStore } from "@/redux/store";
import { Delete, Search } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import { DataGrid, GridRenderCellParams, GridToolbar } from "@mui/x-data-grid";
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface FavoriteTableInterface {}

const FavoriteTable: React.FC<FavoriteTableInterface> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize = 10;
  const dispatch = useDispatch();
  const stateFavorites = useSelector((store: AppStore) => store.favorites);

  const handleClick = (person: Person) => {
    dispatch(removeFavorite(person));
  };

  // Filter favorites based on search term
  const filteredFavorites = useMemo(() => {
    return stateFavorites.filter(
      (person) =>
        searchTerm === "" ||
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stateFavorites, searchTerm]);

  const getHappinessColor = (level: number) => {
    if (level >= 8) return "#4caf50";
    if (level >= 6) return "#ff9800";
    if (level >= 4) return "#f44336";
    return "#9e9e9e";
  };

  const getHappinessEmoji = (level: number) => {
    if (level >= 8) return "😄";
    if (level >= 6) return "😊";
    if (level >= 4) return "😐";
    return "😢";
  };

  const colums = [
    {
      field: "actions",
      type: "actions",
      sortable: false,
      headerName: "🗑️",
      width: 70,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          color="error"
          aria-label="remove favorite"
          onClick={() => handleClick(params.row)}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.1)",
            },
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 2,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: "#ff4081",
            color: "white",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 2,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          variant="outlined"
          size="small"
          sx={{
            borderColor: "#ff4081",
            color: "#ff4081",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "levelOfHappiness",
      headerName: "Happiness Level",
      flex: 1.5,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: getHappinessColor(params.value),
              fontSize: "1.1rem",
            }}
          >
            {params.value}/10
          </Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            {getHappinessEmoji(params.value)}
          </Typography>
        </Box>
      ),
    },
  ];
  return (
    <Box sx={{ width: "100%", minHeight: 400, padding: 2 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "#1a1a1a",
          fontWeight: 600,
          marginBottom: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        ❤️ My Favorites ({stateFavorites.length})
      </Typography>

      {stateFavorites.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            marginY: 2,
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            color: "#667eea",
          }}
        >
          No favorites yet! Add some people to your favorites from the main
          table.
        </Alert>
      ) : (
        <>
          {/* Search Bar */}
          <TextField
            label="Search favorites..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              marginBottom: 2,
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#ff4081",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ff4081",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#ff4081" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Results Summary */}
          <Typography
            variant="body2"
            sx={{
              marginBottom: 2,
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Showing {filteredFavorites.length} of {stateFavorites.length}{" "}
            favorites
          </Typography>

          {/* Data Grid */}
          <DataGrid
            rows={filteredFavorites}
            columns={colums}
            disableColumnSelector
            disableSelectionOnClick
            autoHeight
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row: any) => row.id}
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              width: "100%",
              minWidth: "800px",
              "& .MuiDataGrid-root": {
                border: "none",
                width: "100%",
              },
              "& .MuiDataGrid-main": {
                width: "100%",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                padding: "12px 16px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(255, 64, 129, 0.1)",
                borderBottom: "2px solid #ff4081",
                fontSize: "1rem",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "rgba(255, 64, 129, 0.05)",
                },
                "&:nth-of-type(even)": {
                  backgroundColor: "rgba(255, 240, 245, 0.3)",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid rgba(255, 64, 129, 0.2)",
                backgroundColor: "rgba(255, 64, 129, 0.05)",
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default FavoriteTable;
