$(document).ready(function () {
  var selectedImage = $("#selected_image");

  $("#edit_selected_image").change(async function () {
    await removeImage();
    sendImage(selectedImage);
    displaySelectedImage(this);
  });

  $("#selected_image").change(function () {
    sendImage(selectedImage);
    displaySelectedImage(this);
  });

  function removeImage() {
    data = {
      image: $("#imageToUpload").val(),
    };

    $.ajax({
      type: "POST",
      url: "/admin/image/remove",
      data: data,
      success: function (data) {},
      error: function (xhr, textStatus, errorThrown) {
        alert("Error in Operation");
      },
    });
  }
  function sendImage(selectedImage) {
    var form_data = new FormData();
    let files = selectedImage.get(0).files;
    form_data.append("image", files[0]);

    $.ajax({
      type: "POST",
      url: "/image/upload",
      contentType: false,
      cache: false,
      processData: false,
      data: form_data,
      success: function (data) {
        ImageName = JSON.parse(data);
        $("#imageToUpload").val(ImageName.image);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Error in Operation");
      },
    });
  }

  function displaySelectedImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $("#display_image").attr("src", e.target.result);
      };

      reader.onload = function (e) {
        $("#display_selected_image").css({ display: "block" });
        $("#display_selected_image").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
});
