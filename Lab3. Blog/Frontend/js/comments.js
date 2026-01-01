const getAllCommentsForPost = async (postId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/posts/${postId}/comments`
    );
    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error("Błąd podczas pobierania komentarzy:", error);
    return [];
  }
};

const getCommentsToApprove = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/comments/to-approve"
    );
    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error("Błąd podczas pobierania komentarzy do akceptacji:", error);
    return [];
  }
};

const approveComment = async (commentId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments/${commentId}/approve`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { error: errorData.error };
    }
  } catch (error) {
    console.error("Błąd podczas zatwierdzania komentarza:", error);
    return { error };
  }
};

const renderCommentsForPost = async (postId) => {
  let comments;
  if (postId === -1) {
    comments = await getCommentsToApprove();
  } else {
    comments = await getAllCommentsForPost(postId);
  }
  const commentsWrapper = document.getElementById("comments_wrapper");
  commentsWrapper.innerHTML = "";

  comments.forEach((comment) => {
    const commentCard = document.createElement("div");
    commentCard.classList.add("card", "mb-2");

    const commentCardBody = document.createElement("div");
    commentCardBody.classList.add("card-body");

    const commentAuthor = document.createElement("h5");
    commentAuthor.classList.add("card-title");
    commentAuthor.textContent = `Autor: ${comment.author}`;

    const commentContent = document.createElement("p");
    commentContent.classList.add("card-text");
    commentContent.textContent = comment.body;

    commentCardBody.appendChild(commentAuthor);
    commentCardBody.appendChild(commentContent);

    if (postId === -1) {
      const approveButton = document.createElement("button");
      approveButton.classList.add("btn", "btn-success", "mb-2");
      approveButton.textContent = "Zatwierdź komentarz";
      approveButton.addEventListener("click", async () => {
        await approveComment(comment.id);
        renderCommentsForPost(-1);
      });
      commentCardBody.appendChild(approveButton);
    }

    commentCard.appendChild(commentCardBody);
    commentsWrapper.appendChild(commentCard);
  });
};

const addNewCommentToPost = async (postId, comment) => {
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...comment }),
    }
  );

  return await response.json();
};

if (document.getElementById("addCommentButton")) {
  document
    .getElementById("addCommentButton")
    .addEventListener("click", async () => {
      const postId = document.getElementById("commentPostId").value;
      const author = document.getElementById("commentAuthor").value;
      const body = document.getElementById("commentBody").value;

      const newComment = {
        author,
        body,
      };

      const addedComment = await addNewCommentToPost(postId, newComment);
      if (addedComment.error) {
        alert(addedComment.error);
        return;
      }
      alert("Komentarz przesłany do akceptacji!");
      document.getElementById("commentAuthor").value = "";
      document.getElementById("commentBody").value = "";
      document.getElementById("closeAddCommentModal").click();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  if (page === "moderation.html") {
    renderCommentsForPost(-1);
  }
});

if (document.getElementById("postCommentsModal")) {
  const modal = document.getElementById("postCommentsModal");
  setInterval(() => {
    const currentPostCommentsID = document.getElementById(
      "currentPostComments"
    ).value;
    if (modal.classList.contains("show") && currentPostCommentsID) {
      renderCommentsForPost(currentPostCommentsID);
    }
  }, 2500);

  modal.addEventListener("hidden.bs.modal", function () {
    document.getElementById("currentPostComments").value = "";
  });
}
