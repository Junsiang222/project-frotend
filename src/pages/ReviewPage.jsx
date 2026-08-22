import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import {
  getReviewsByCourt,
  addReview,
  deleteReview,
} from "../../utils/api_reviews";
import { useCookies } from "react-cookie";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  Stack,
  IconButton,
  Avatar,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import { toast } from "sonner";
import Header from "../components/Header";

const REVIEWS_PER_PAGE = 5;

const ReviewPage = () => {
  const { courtId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;
  const userId = cookies.currentuser?._id;

  const loadReviews = async () => {
    const data = await getReviewsByCourt(courtId);
    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, [courtId]);

  const { average, total, distribution } = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return { average: sum / total, total, distribution };
  }, [reviews]);

  // ✅ 排序
  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "newest") {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highest") {
      copy.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      copy.sort((a, b) => a.rating - b.rating);
    }
    return copy;
  }, [reviews, sortBy]);

  // ✅ 分页
  const pageCount = Math.max(1, Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = sortedReviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  const handleAdd = async () => {
    if (!token || !userId) {
      toast.error("Please log in first");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    try {
      await addReview(courtId, userId, rating, comment, token);
      await loadReviews();
      setComment("");
      setRating(0);
      setPage(1);
      toast.success("Review submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id, token);
      setReviews(reviews.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <>
      <Header current="review" />

      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(90deg, rgba(74,222,128,0.08), rgba(74,222,128,0.02))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          py: 4,
          px: { xs: 2, md: 6 },
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <SportsTennisIcon sx={{ color: "primary.main", fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Reviews
              </Typography>
              <Typography color="text.secondary">
                Share your experience and help others find the best courts!
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 6 } }}>
        <Grid container spacing={3}>
          {/* 左边：总评分 + 写评论，堆叠在一起 */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 3 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Overall Rating
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h3" fontWeight={700}>
                    {average.toFixed(1)}
                  </Typography>
                  <Box display="flex">
                    {[1, 2, 3, 4, 5].map((i) =>
                      i <= Math.round(average) ? (
                        <StarIcon key={i} sx={{ color: "warning.main" }} />
                      ) : (
                        <StarBorderIcon key={i} sx={{ color: "warning.main" }} />
                      )
                    )}
                  </Box>
                </Box>
                <Typography color="text.secondary" mb={2}>
                  ({total} reviews)
                </Typography>

                {[5, 4, 3, 2, 1].map((star) => (
                  <Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" sx={{ width: 32 }}>
                      {star} ★
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={total ? (distribution[star] / total) * 100 : 0}
                      color="success"
                      sx={{ flex: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ width: 36, textAlign: "right" }}>
                      {total ? Math.round((distribution[star] / total) * 100) : 0}%
                    </Typography>
                  </Box>
                ))}
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Write a Review
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Your Rating
                </Typography>
                <Box display="flex" gap={0.5} mb={3}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconButton
                      key={i}
                      size="small"
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {i <= (hoverRating || rating) ? (
                        <StarIcon sx={{ color: "warning.main" }} />
                      ) : (
                        <StarBorderIcon sx={{ color: "warning.main" }} />
                      )}
                    </IconButton>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Your Comment
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 300))}
                  helperText={`${comment.length} / 300`}
                  FormHelperTextProps={{ sx: { textAlign: "right" } }}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  onClick={handleAdd}
                >
                  Submit Review
                </Button>
              </Card>
            </Box>
          </Grid>

          {/* 右边：评论列表，占大空间 */}
          <Grid item xs={12} md={8} lg={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                All Reviews ({total})
              </Typography>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="highest">Highest Rating</MenuItem>
                  <MenuItem value="lowest">Lowest Rating</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {paginatedReviews.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No reviews yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {paginatedReviews.map((r) => (
                  <Card key={r._id} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" gap={2}>
                        <Avatar>{r.user?.name?.[0]?.toUpperCase() || "?"}</Avatar>
                        <Box>
                          <Typography fontWeight={600}>
                            {r.user?.name || "Anonymous"}
                          </Typography>
                          <Box display="flex" mt={0.5} mb={1}>
                            {[1, 2, 3, 4, 5].map((i) =>
                              i <= r.rating ? (
                                <StarIcon key={i} sx={{ color: "warning.main", fontSize: 18 }} />
                              ) : (
                                <StarBorderIcon key={i} sx={{ color: "warning.main", fontSize: 18 }} />
                              )
                            )}
                          </Box>
                          <Typography variant="body2">{r.comment}</Typography>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="caption" color="text.secondary">
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                        </Typography>
                        {(r.user?._id === userId || cookies.currentuser?.role === "admin") && (
                          <IconButton color="error" size="small" onClick={() => handleDelete(r._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}

            {pageCount > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="success"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ReviewPage;