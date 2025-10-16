import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  getReviewsByCourt,
  addReview,
  deleteReview,
} from "../../utils/api_reviews";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const ReviewPage = () => {
  const { courtId } = useParams(); //useParams() 是 React Router 的 Hook，用来从网址里取得动态参数。例如当网址是 /booking/123，useParams() 会回传 { courtId: "123" }
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [cookies] = useCookies(["currentuser"]); //loginpage 拿到 "currentuser"
  const token = cookies.currentuser?.token;
  const userId = cookies.currentuser?._id;

  // 载入评论
  useEffect(() => {
    const fetchData = async () => {
      const data = await getReviewsByCourt(courtId);
      setReviews(data);
    };
    fetchData();
  }, [courtId]);

  // 新增评论
  const handleAdd = async () => {
    if (!comment.trim()) return;  //trim() 确保用户不能提交空白评论（像只按空格或换行）
    await addReview(courtId, userId, comment, token);   
    const updatedReviews = await getReviewsByCourt(courtId);
    setReviews(updatedReviews);
    setComment("");
  };

  // 删除评论
  const handleDelete = async (id) => {
    await deleteReview(id, token);
    setReviews(reviews.filter((r) => r._id !== id));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Reviews
      </Typography>

      {/* 评论输入框 */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Write a review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: "black", textTransform: "none" }}
          endIcon={<SendIcon />}
          onClick={handleAdd}
        >
          Post
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* 评论列表 */}
      {reviews.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No reviews yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map((r) => (
            <Card
              key={r._id}
              sx={{
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                <b>{r.user?.name || "Anonymous"}:</b> {r.comment}
              </Typography>
              {(r.user?._id === userId ||
                cookies.currentuser?.role === "admin") && (
                <IconButton color="error" onClick={() => handleDelete(r._id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ReviewPage;
