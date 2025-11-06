const uploadPic = document.getElementById("uploadPic");
  const profilePic = document.getElementById("profilePic");

  uploadPic.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });