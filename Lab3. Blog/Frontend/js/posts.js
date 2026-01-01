const getAllPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/posts");
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Błąd podczas pobierania postów:", error);
    return [];
  }
};

const addNewPost = async (post) => {
  const response = await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...post }),
  });

  return await response.json();
};

const renderPosts = async () => {
  const posts = await getAllPosts();
  const postsWrapper = document.getElementById("posts_wrapper");
  postsWrapper.innerHTML = "";

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("card", "mb-3");

    const postCardBody = document.createElement("div");
    postCardBody.classList.add("card-body");

    const postTitle = document.createElement("h5");
    postTitle.classList.add("card-title");
    postTitle.textContent = post.title;

    const postBody = document.createElement("p");
    postBody.classList.add("card-text");
    postBody.textContent = post.body;

    const cardButtonShowComments = document.createElement("button");
    cardButtonShowComments.classList.add("btn", "btn-primary");
    cardButtonShowComments.setAttribute("data-bs-toggle", "modal");
    cardButtonShowComments.setAttribute("data-bs-target", "#postCommentsModal");
    cardButtonShowComments.textContent = "Zobacz komentarze";
    cardButtonShowComments.addEventListener("click", () => {
      document.getElementById("currentPostComments").value = post.id;
      renderCommentsForPost(post.id);
    });

    const cardButtonAddComment = document.createElement("button");
    cardButtonAddComment.classList.add("btn", "btn-primary", "ms-2");
    cardButtonAddComment.setAttribute("data-bs-toggle", "modal");
    cardButtonAddComment.setAttribute("data-bs-target", "#addCommentModal");
    cardButtonAddComment.textContent = "Dodaj komentarz";
    cardButtonAddComment.addEventListener("click", () => {
      document.getElementById("commentPostId").value = post.id;
    });

    postCardBody.appendChild(postTitle);
    postCardBody.appendChild(postBody);
    postCardBody.appendChild(cardButtonShowComments);
    postCardBody.appendChild(cardButtonAddComment);
    postCard.appendChild(postCardBody);
    postsWrapper.appendChild(postCard);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  renderPosts();
});

document.getElementById("addPostButton").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  const newPost = { title, body };

  const addedPost = await addNewPost(newPost);
  if (addedPost.error) {
    alert(addedPost.error);
    return;
  }

  document.getElementById("title").value = "";
  document.getElementById("body").value = "";

  renderPosts();
  document.getElementById("closePostModal").click();
});
