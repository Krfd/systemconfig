$(document).ready(function(){
    loadFoodMenus();
});


function loadFoodMenus() {
    $.post("dirs/food_menu/components/main.php", {
    }, function (data){
        $("#load_foodmenu").html(data);
    });
}




/*Function save draft base on user login*/
function saveDraft() {

    var formData = new FormData();

    // Collect values
    formData.append("Category", $("#category").val());
    formData.append("Menu", $("#menu_name").val());
    formData.append("MenuCode", $("#menu_code").val());
    formData.append("PrepTime", $("#prep_time").val());
    formData.append("Serving", $("#serving_size").val());
    formData.append("Calories", $("#calories").val());
    formData.append("Notes", $("#tags").val());
    formData.append("Price", $("#price").val());
    formData.append("Status", $("#status").val());
    formData.append("Dinein", $("#dine_in").is(":checked") ? 1 : 0);
    formData.append("Takeout", $("#take_out").is(":checked") ? 1 : 0);
    formData.append("Delivery", $("#delivery").is(":checked") ? 1 : 0);
    formData.append("Description", $("#description").val());

    // ✅ Append image file
    var imageInput = document.getElementById("menu-img");
    if (imageInput && imageInput.files.length > 0) {
        formData.append("menu-img", imageInput.files[0]);
    }

    var MenuCode = $("#menu_code").val();
    if (!MenuCode) {
        Swal.fire({
            icon: "warning",
            title: "Invalid",
            text: "Please fill up.",
            timer: 2000,
            showConfirmButton: false
        });
        return; // stop the function
    }

    $.ajax({
        url: "dirs/food_menu/actions/save_draft.php",
        type: "POST",
        data: formData,
        processData: false, // IMPORTANT
        contentType: false, // IMPORTANT
        success: function (response) {

            // If PHP already sends JSON header, no need to parse
            if (response.isSuccess === true) {

                loadFoodMenus();
                $("#frm-add-menu")[0].reset();

                Swal.fire({
                    icon: "success",
                    title: "Draft Saved",
                    text: "Menu draft saved successfully.",
                    timer: 2000,
                    showConfirmButton: false
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message || "Failed to save draft",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to save draft.",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}
