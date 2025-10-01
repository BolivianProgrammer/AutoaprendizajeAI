import { Person } from "@/models";
import { addFavorite } from "@/redux/states";
import { AppStore } from "@/redux/store";
import {
  Checkbox,
  TextField,
  Box,
  InputAdornment,
  Chip,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { DataGrid, GridRenderCellParams, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface PeopleTableInterface {}

const PeopleTable: React.FC<PeopleTableInterface> = () => {
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const pageSize = 10;
  const dispatch = useDispatch();
  const statePeople = useSelector((store: AppStore) => store.people);
  const favoritePeople = useSelector((store: AppStore) => store.favorites);

  const findPerson = (person: Person) =>
    !!favoritePeople.find((p) => p.id === person.id);
  const filterPerson = (person: Person) =>
    favoritePeople.filter((p) => p.id !== person.id);

  const handleChange = (person: Person) => {
    const filteredPeople = findPerson(person)
      ? filterPerson(person)
      : [...selectedPeople, person];
    dispatch(addFavorite(filteredPeople));
    setSelectedPeople(filteredPeople);
  };

  // Get unique categories and companies for filter dropdowns
  const uniqueCategories = useMemo(() => {
    const categories = statePeople
      .map((person) => person.category)
      .filter(Boolean);
    return [...new Set(categories)];
  }, [statePeople]);

  const uniqueCompanies = useMemo(() => {
    const companies = statePeople
      .map((person) => person.company)
      .filter(Boolean);
    return [...new Set(companies)];
  }, [statePeople]);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    return statePeople.filter((person) => {
      const matchesSearch =
        searchTerm === "" ||
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "" || person.category === categoryFilter;
      const matchesCompany =
        companyFilter === "" || person.company === companyFilter;

      return matchesSearch && matchesCategory && matchesCompany;
    });
  }, [statePeople, searchTerm, categoryFilter, companyFilter]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleCompanyChange = (event: SelectChangeEvent) => {
    setCompanyFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setCompanyFilter("");
  };

  const getHappinessColor = (level: number) => {
    if (level >= 8) return "#4caf50"; // Green
    if (level >= 6) return "#ff9800"; // Orange
    if (level >= 4) return "#f44336"; // Red
    return "#9e9e9e"; // Gray
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
      headerName: "❤️",
      width: 70,
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          size="small"
          checked={findPerson(params.row)}
          onChange={() => handleChange(params.row)}
          sx={{
            color: "#ff4081",
            "&.Mui-checked": {
              color: "#ff4081",
            },
          }}
        />
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
            backgroundColor: "#667eea",
            color: "white",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#5a6fd8",
            },
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
            borderColor: "#764ba2",
            color: "#764ba2",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(118, 75, 162, 0.1)",
            },
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

  useEffect(() => {
    setSelectedPeople(favoritePeople);
  }, [favoritePeople]);

  return (
    <Box sx={{ width: "100%", padding: 1 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#1a1a1a",
            fontWeight: 700,
            marginBottom: 3,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          People Directory
        </Typography>

        {/* Search and Filter Controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search people..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Company</InputLabel>
            <Select
              value={companyFilter}
              onChange={handleCompanyChange}
              label="Company"
            >
              <MenuItem value="">All Companies</MenuItem>
              {uniqueCompanies.map((company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || categoryFilter || companyFilter) && (
            <Chip
              label="Clear Filters"
              onClick={clearFilters}
              color="secondary"
              variant="outlined"
              icon={<FilterList />}
            />
          )}
        </Box>

        {/* Results Summary */}
        <Typography
          variant="body2"
          sx={{
            marginBottom: 2,
            color: "#666",
            fontStyle: "italic",
          }}
        >
          Showing {filteredData.length} of {statePeople.length} people
        </Typography>

        {/* Data Grid */}
        <DataGrid
          rows={filteredData}
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
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              borderBottom: "2px solid #667eea",
              fontSize: "1rem",
              fontWeight: 600,
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.05)",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "rgba(248, 249, 255, 0.5)",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid rgba(102, 126, 234, 0.2)",
              backgroundColor: "rgba(102, 126, 234, 0.05)",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default PeopleTable;
