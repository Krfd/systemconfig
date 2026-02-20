$(document).ready(function () {
  loadDashboard();
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $.post(
    "dirs/incoming/picklistbasket/components/main.php",
    {},
    function (data) {
      $("#basket_content").html(data);
    },
  );
  cancelPicklist();
  loadBasket();
}

function loadReturn() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// function addToPicklist() {
$(document).on("click", ".picklist-num", function () {
  const picklistNumber = $(this).data("picklist-num");
  console.log(`PICKLIST NUMBER: ${picklistNumber}`);

  openPicklist();
});

let basketTable;

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

function loadBasket() {
  $.ajax({
    url: "dirs/incoming/picklistbasket/actions/picklisteditems.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          rows.push([
            `<td data-picklist-num="${item.PickLst_Num}">${item.PickLst_Num}</td>`,
            item.DocDate || "",
            item.PickedQty || "",
            '<div class="dropdown">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                    <li><a class="dropdown-item picklist-num" href="#" data-picklist-num="${item.PickLst_Num}">Open</a></li>
                    <li><a class="dropdown-item cancel-picklist" href="#" data-picklist="${item.PickLst_Num}">Cancel</a></li>
                    <li><a class="dropdown-item print-item" href="#">Print</a></li>
              </ul>` +
              "</div>",
          ]);
        });

        $("#basketTable").DataTable().clear().destroy();

        $("#basketTable").DataTable({
          data: rows,
          columns: [
            { title: "Picklist No.", className: "text-center" },
            { title: "Date", className: "text-start" },
            { title: "Quantity" },
            { title: "", orderable: false },
          ],
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          order: [[0, "desc"]],
          rowCallback: function (row, data) {
            $("td", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(0)", row).addClass("text-primary picklist-num");
            $("td:eq(2)", row).css("text-align", "start");

            // Add hover effect to empty rows too
            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#FFFBDF");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#basketTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
              <tr class="empty-row" style="background: #FFFBDF">
                <td colspan="4" style="background: #FFFBDF">&nbsp;</td>
              </tr>
            `);
              $emptyRow.css({
                background: "#FFFBDF",
                height: "40px",
                "min-height": "40px",
                cursor: "pointer",
              });
              $emptyRow.hover(
                function () {
                  $(this).css("background", "#FFF4C2");
                },
                function () {
                  $(this).css("background", "#FFFBDF");
                },
              );
              tableBody.append($emptyRow);
            }
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}

function openPicklist() {
  $.post("dirs/incoming/picklistitems/picklistItem.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function cancelPicklist() {
  $(document).on("click", ".cancel-picklist", function () {
    const picklistId = $(this).data("picklist");

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel Picklist " + picklistId,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      // cancelButtonColor: "#3085d6",
      cancelButtonText: "Back",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Cancelled!",
          "Picklist " + picklistId + " has been cancelled.",
          "success",
        );

        $(this).closest("tr").remove();
      }
    });
  });
}
