function loadDeliveryBasket(tableId, url) {
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (
        !response ||
        response.isSuccess !== "success" ||
        !Array.isArray(response.Data)
      ) {
        response = { isSuccess: "success", Data: [] };
      }

      let sortedData = response.Data.sort(
        (a, b) => Number(b.PKList_Number || 0) - Number(a.PKList_Number || 0),
      );

      let grouped = {};

      sortedData.forEach((item) => {
        // let key = item.PKList_Number;
        let key = item.PKList_Number.toString().trim().toUpperCase();

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      let rows = [];

      if (response.isSuccess === "success") {
        // sortedData.forEach((item) => {
        Object.keys(grouped).forEach((picklist) => {
          console.log(`BASKET ITEMS: ${JSON.stringify(picklist)}`);
          console.log(``);

          rows.push(["", `<strong>Picklist: ${picklist}</strong>`, "", "", ""]);

          grouped[picklist].forEach((item) => {
            // const isDisabled =
            //   item.BatchBasket_Num !== null &&
            //   item.BatchBasket_Num !== undefined &&
            //   item.BatchBasket_Num !== ""
            //     ? "disabled"
            //     : "";

            // `<input type="checkbox" name="checkbox" id="${item.BatchBasket_Num}" data-rownum="${item.RowNumOrder}"
            //   class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,

            rows.push([
              `<input type="checkbox" name="checkbox"
            class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer">`,
              item.PKList_Number || "",
              item.RequestItem_Qty || "",
              (() => {
                let status = item.PickListStatus || "";

                if (status === "UA") status = "UNASSIGNED";
                else if (status === "A") status = "ASSIGNED";

                let badgeClass = "primary";

                if (status === "UNASSIGNED") badgeClass = "warning";
                else if (status === "ASSIGNED") badgeClass = "primary";

                return `<span class="badge bg-${badgeClass}">${status}</span>`;
              })(),
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  ${
                    item.LoadingBasket_Status !== "IT"
                      ? `
                    <li>
                      <a class="dropdown-item ${
                        item.LoadingBasket_Status === "A"
                          ? "edit-branch"
                          : "assign-branch"
                      }" 
                        href="#" 
                        data-picklist="${item.PKList_Number}" 
                        data-lbNum="${item.BatchBasket_Num}">
                        ${
                          item.LoadingBasket_Status === "A"
                            ? "Edit Assignment"
                            : "Set Assignment"
                        }
                      </a>
                    </li>
                  `
                      : ""
                  }
                </ul>
              </div>`,
            ]);

            // END OF NEWLY ADDED LOOP
          });
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable(tableId)) {
          $(tableId).DataTable().clear().destroy();
        }

        $(tableId).DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "Picklist No." },
            { title: "Quantity", className: "text-start" },
            {
              title: "Status",
            },
            { title: "", orderable: false },
          ],
          createdRow: function (row, data, dataIndex) {
            let originalItem = sortedData[dataIndex];
            if (originalItem) {
              $(row)
                .attr("data-rownum", originalItem.BatchBasket_Num)
                .attr("data-picklist", originalItem.PKList_Number)
                .attr("data-lbNum", originalItem.BatchBasket_Num)
                .attr("data-batchnum", originalItem.BatchBasket_Num);
            }
          },
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          // order: [[0, "desc"]],
          order: [],
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(1)", row).addClass("text-primary ps-2");
            $("td:eq(1)", row).css("text-align", "start");
            $("td:eq(2)", row).css("text-align", "start ps-2");
            $("td:eq(3)", row).css("text-align", "start ps-2");

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
            let tableBody = $(tableId + " tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td colspan="4" style="background: #FFFBDF">&nbsp;</td>
                  </tr>
                `);

              $emptyRow.css({
                background: "#FFFBDF",
                height: "40px",
                "min-height": "40px",
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

            const selectionMode =
              $("#basketTableAssigned").data("selectionMode") || false;

            // Target dropdown buttons
            $(tableId + " tbody tr").each(function () {
              const dropdownBtn = $(this).find(
                "button[data-bs-toggle='dropdown']",
              );

              if (selectionMode) {
                dropdownBtn.prop("disabled", true).addClass("disabled");
              } else {
                dropdownBtn.prop("disabled", false).removeClass("disabled");
              }
            });
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
  // });
}
