$(document).ready(function () {
  loadDashboard();
  if (
    typeof CURRENT_ROWNUM !== "undefined" &&
    CURRENT_ROWNUM !== "" &&
    PICKLIST_NUM !== "undefined" &&
    PICKLIST_NUM !== ""
  ) {
    loadIncomingSrnPicklist(CURRENT_ROWNUM, PICKLIST_NUM);
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

function loadBasketContent() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadDashboard() {
  $.post(
    "dirs/incoming/picklistitems/components/main.php",
    {},
    function (data) {
      $("#item_content").html(data);
    },
  );
}

function loadIncomingSrnPicklist(CURRENT_ROWNUM, PICKLIST_NUM) {
  $.ajax({
    url: "dirs/incoming/picklistbasket/actions/picklisteditems.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      // console.log(response.Data);
      let rows = [];
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          rows.push([
            item.BaseNum_SRN || "",
            item.DocDate || "",
            item.Prep_Branch || "",
            item.PickedQty || "",
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="openPicklistedIncoming(${item.RowNum})">Open</a></li>
                <li><a class="dropdown-item" href="#">Print</a></li>
              </ul>
            </div>`,
          ]);
        });

        $("#picklistItemTable").DataTable().clear().destroy();
        $("#picklistItemTable").DataTable({
          data: rows,
          columns: [
            { title: "SRN", className: "text-center" },
            { title: "Date", className: "text-start" },
            { title: "Requesting Branch" },
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
            $("td:eq(0)", row).addClass("text-primary");
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
            let tableBody = $("#picklistItemTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
              <tr class="empty-row" style="background: #FFFBDF">
                <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
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

// function openPicklistedIncoming(RowNum) {
//   $.post("dirs/incoming/form/form.php", { RowNum: RowNum }, function (data) {
//     $("#main-content").html(data);
//   });
// }
