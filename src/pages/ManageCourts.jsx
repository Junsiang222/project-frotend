import { Link, useParams, useNavigate } from "react-router";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import Header from "../components/Header";
import { getCourts, deleteCourt } from "../../utils/api_court";

const ManageCourts = () => {
  const { location } = useParams();
  const decodedLocation = decodeURIComponent(location);
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "user" } = currentuser;

  const [courts, setCourts] = useState([]);

  const loadCourts = () => {
    getCourts(decodedLocation).then(setCourts);
  };

  useEffect(() => {
    // 不是 admin 就踢出去，避免直接打网址进来
    if (role !== "admin") {
      navigate("/courts");
      return;
    }
    loadCourts();
  }, [decodedLocation]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this court?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCourt(id, token);
          setCourts((prev) => prev.filter((c) => c._id !== id));
          toast.success("Court deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete court");
        }
      }
    });
  };

  return (
    <>
      <Header current="dashboard" />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            Manage Courts
          </Typography>
          <Button component={Link} to="/courts/new" variant="contained" color="success">
            Add New Court
          </Button>
        </Box>
        <Chip label={decodedLocation} color="primary" sx={{ mb: 3 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Open</TableCell>
                <TableCell>Close</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courts.map((court) => (
                <TableRow key={court._id}>
                  <TableCell>{court.name}</TableCell>
                  <TableCell>RM {court.price}</TableCell>
                  <TableCell>{court.openTime}</TableCell>
                  <TableCell>{court.closeTime}</TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      to={`/courts/${court._id}/edit`}
                      size="small"
                      variant="contained"
                      color="info"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(court._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {courts.length === 0 && (
          <Typography align="center" color="text.secondary" py={4}>
            No courts under this location yet.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default ManageCourts;