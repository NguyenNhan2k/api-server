const displayModalCommnent = () => {
    const addComment = document.querySelector('.button-comment');
    const modalComment = document.querySelector('.modal-comment');
    if (addComment) {
        addComment.addEventListener('click', () => {
            modalComment.style.display = 'flex';
        });
    }
};
function closeModalComment(close, modal) {
    const eleClose = document.querySelector(close);
    const eleModal = document.querySelector(modal);
    if (eleClose && eleModal) {
        eleModal.style.display = 'none';
    }
}
function requiedLogin(isLogin) {
    if (!isLogin) {
        alert('Vui lòng đăng nhập để bình luận');
    } else {
        displayModalCommnent();
    }
}
