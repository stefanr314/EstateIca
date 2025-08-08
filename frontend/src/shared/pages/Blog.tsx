import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  Container,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const sections = [
  "Technology",
  "Design",
  "Culture",
  "Business",
  "Politics",
  "Opinion",
  "Science",
  "Health",
  "Style",
  "Travel",
];

const featuredPosts = [
  {
    title: "Featured post",
    date: "Nov 12",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
  },
  {
    title: "Post title",
    date: "Nov 11",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
  },
];

const archives = [
  "March 2020",
  "February 2020",
  "January 2020",
  "December 2019",
  "November 2019",
  "October 2019",
  "September 2019",
  "August 2019",
  "July 2019",
  "June 2019",
  "May 2019",
  "April 2019",
];

const social = ["GitHub", "Twitter", "Facebook"];

const Blog = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Button size="small">Subscribe</Button>
          <Typography
            variant="h5"
            color="inherit"
            align="center"
            sx={{ flex: 1 }}
          >
            Blog
          </Typography>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <Button variant="outlined" size="small">
            Sign up
          </Button>
        </Toolbar>
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          {sections.map((section) => (
            <Typography variant="body2" color="inherit" key={section}>
              {section}
            </Typography>
          ))}
        </Toolbar>
      </AppBar>

      {/* Main featured post */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: (theme) => theme.palette.grey[800],
          color: "#fff",
          mb: 4,
          p: 4,
        }}
      >
        <Grid container>
          <Grid sx={{ display: { md: 6 } }}>
            <Typography variant="h3" gutterBottom>
              Title of a longer featured blog post
            </Typography>
            <Typography variant="h5">
              Multiple lines of text that form the lede, informing new readers
              quickly and efficiently about what’s most interesting in this
              post’s contents…
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Sub featured posts */}
      <Grid container spacing={4}>
        {featuredPosts.map((post) => (
          <Grid sx={{ display: { xs: 12, md: 6 } }} key={post.title}>
            <Card sx={{ display: "flex" }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography component="h2" variant="h5">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {post.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {post.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Continue reading...
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                sx={{ width: 160, display: { xs: "none", sm: "block" } }}
                image="https://via.placeholder.com/160"
                alt={post.title}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={5} sx={{ mt: 3 }}>
        <Grid sx={{ display: { xs: 12, md: 8 } }}>
          <Typography variant="h6" gutterBottom>
            From the Firehose
          </Typography>
          <Divider />
          {/* Posts would go here */}
        </Grid>
        <Grid sx={{ display: { xs: 12, md: 4 } }}>
          <Paper sx={{ p: 2, backgroundColor: "grey.200" }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography>
              Etiam porta sem malesuada magna mollis euismod. Cras mattis
              consectetur purus sit amet fermentum.
            </Typography>
          </Paper>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Archives
          </Typography>
          {archives.map((archive) => (
            <Typography key={archive}>{archive}</Typography>
          ))}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Social
          </Typography>
          {social.map((network) => (
            <Typography key={network}>{network}</Typography>
          ))}
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ mt: 8, py: 6, bgcolor: "background.paper" }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Something here to give the footer a purpose!
        </Typography>
      </Box>
    </Container>
  );
};

export default Blog;
