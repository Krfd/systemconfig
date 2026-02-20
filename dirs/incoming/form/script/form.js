$(document).ready(function () {
  loadDashboard();
  if (typeof CURRENT_ROWNUM !== "undefined" && CURRENT_ROWNUM !== "") {
    loadIncomingDetails(CURRENT_ROWNUM);
  }
});

$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $.post("dirs/incoming/form/components/main.php", {}, function (data) {
    $("#form-content").html(data);
  });
  addToPicklist();
}

function loadReturn() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// function loadReturnToPicklistItem() {
//   $.post("dirs/incoming/picklistitems/picklistitem.php", {}, function (data) {
//     $("#main-content").html(data);
//   });
// }

window.addEventListener("DOMContentLoaded", function () {
  // Get today's date
  const today = new Date();

  // Format the date as yyyy-mm-dd (which is what the date input expects)
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = today.getDate().toString().padStart(2, "0"); // Add leading zero if needed

  // Combine into the format yyyy-mm-dd
  const formattedDate = `${year}-${month}-${day}`;

  // Set the input value to today's date
  document.getElementById("date").value = formattedDate;
});

function loadIncomingDetails(RowNum) {
  $.ajax({
    url: "dirs/incoming/form/actions/get_openincoming.php",
    type: "POST",
    data: { RowNum: RowNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rowCount = response.Items.length;
        let totalQty = 0;

        let header = response.Data;
        let items = response.Items;

        function selectedValue(selector, value) {
          $(selector)
            .empty()
            .append(`<option value="${value}">${value}</option>`);
        }

        selectedValue("#typeOfReq", header.RequestType);
        selectedValue("#destination", header.Destination);
        selectedValue("#branchWhCode", header.DestinationWhs);
        selectedValue("#origin", header.Origin);
        selectedValue("#whcode", header.OriginWhs);

        // ================= HEADER =================
        $("#srn").val(header.BaseNum_SRN);
        $("#date").val(header.DocDate);
        $("#status").val(header.RequestStatus);
        $("#purpose").val(header.RequestPurpose);
        $("#reqBy").val(header.PrepBy);
        $("#remarks").val(header.Remarks);

        // ================= ITEMS =================
        let rows = "";

        items.forEach(function (item, index) {
          let quantity = parseFloat(item.Quantity) || 0;
          totalQty += quantity;
          rows += `
            <tr style="height: 40px; min-height: 40px">
              <td class="align-middle" style="background:#FFFBDF; padding: 3px">${index + 1}</td>
              <td class="align-middle" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
              <td class="align-middle" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
              <td class="align-middle" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
              <td class="align-middle" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
            </tr>
          `;
        });

        $("#totalIncomingQty").text(totalQty);
        $("#openIncomingTable tbody").html(rows);

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
              </tr>
            `;
            $("#openIncomingTable tbody").append(emptyRow);
          }
          $("#totalQuantity").text(totalQty);
        }
      } else {
        alert(response.Data);
      }
    },
    error: function (xhr) {
      console.error(xhr.responseText);
    },
  });
}

function addToPicklist() {
  $(document).on("click", ".picklist-num", function () {
    const picklistNum = $(this).data("picklist-num");

    Swal.fire({
      icon: "question",
      title: `Save this item to picklist ${picklistNum}?`,
      text: "This action cannot be change.",
      confirmButtonText: "Yes, save it",
      showCancelButton: true,
      cancelButtonText: "Not sure",
    }).then((result) => {
      if (result.isConfirmed) {
        // API CALL TO CREATE PICKLIST

        // $.ajax({
        //   url: "dirs/incoming/form/actions/create_picklist.php",
        //   type: "POST",
        //   data: {Picklist: Picklist},
        //   dataType: "json",
        //   success: function(response) {
        //     if (response.isSuccess === "success") {
        Swal.fire({
          icon: "success",
          title: "Items added to picklist",
          confirmButtonText: "OKAY",
        });
        //     } else {
        //       Swal.fire({
        //         icon: "error",
        //         title: "Something went wrong",
        //         text: "Please contact the developer",
        //         confirmButtonText: "OKAY"
        //       })
        //     }
        //   }
        // })
      }
    });
  });
}
