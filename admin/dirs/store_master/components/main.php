<div class="card card-shadow bg-secondary-subtle" style="min-height: 80vh;">
  <div class="card-body">

    <div class="row g-3">

    <div id="load-branches" class="row"></div>


    </div>

  </div>
  <div class="card-footer">
  	<div class="row justify-content-between">
  	    <div class="col-auto">
  	      <button class="btn btn-success" type="button" id="btn-preview-rev">Previous </button>
  	    </div>
  	    <div class="col-auto">
  	      <button class="btn btn-success" type="button" id="btn-next-rev">Next</i></button>
  	    </div>
  	</div>
  </div>
</div>




<!-- Use for draft file upon saving data and deleting json file draft -->
<input type="hidden" id="draft-id">




<!-- Pagination of branches -->
<script>

  $("#search-branch").on("keydown", function(e) {
      if (e.key === "Enter") {
          loadMyBranches();
      }
  });


  $("#filter-branch").on("change", function() {
      loadMyBranches();
  });



    var CurrentPage = 1;
    var PageSize = 20;
    var container = $("#load-branches");

    function loadMyBranches(page = 1) {
        var Branch = $("#filter-branch").val();
        var Search = $("#search-branch").val();

        $.post("dirs/store_master/actions/get_branchrecord.php", {
            CurrentPage: page,
            PageSize: PageSize,
            Branch: Branch,
            Search: Search,
        }, function(data) {
            let response;
            try {
                response = JSON.parse(data);
            } catch (e) {
                console.log.error("Server error.", "Error");
                return;
            }

            if ($.trim(response.isSuccess) === "success") {
                renderBranches(response.Data);
                CurrentPage = page;
            } else {
                console.log.error($.trim(response.Data), "Error");
            }
        });
    }

    function renderBranches(data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html(`
                <div class="text-center text-muted py-4 w-100">
                    <i class="bi bi-file-earmark-text fs-3"></i><br>No Record Found.
                </div>
            `);
            return;
        }

        data.forEach(req => {
            container.append(`
                <div class="col-md-3 col-sm-6 col-12" onclick="loadBData('${req.Bid}')">
                    <div class="info-box p-3 mb-3 border rounded bg-white shadow-sm">
                        <div class="info-box-content">
                            <div class="row mb-2 align-items-center">
                                <label class="col-sm-4 col-form-label fw-bold">Branch:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control-plaintext" value="${req.B_Code}" readonly>
                                </div>
                            </div>
                            <div class="row mb-2 align-items-center">
                                <label class="col-sm-4 col-form-label fw-bold">Location:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control-plaintext" value="${req.Address}" readonly>
                                </div>
                            </div>
                            <div class="row align-items-center">
                                <label class="col-sm-4 col-form-label fw-bold">Status:</label>
                                <div class="col-sm-8">
                                    <span class="badge ${req.Status === 'Active' ? 'bg-success' : 'bg-secondary'}">${req.Status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Initial load
    loadMyBranches(CurrentPage);

    // Pagination buttons
    $("#btn-preview-rev").on("click", function() {
        if (CurrentPage > 1) loadMyBranches(CurrentPage - 1);
        else toastr.info("You're already on the first page.");
    });

    $("#btn-next-rev").on("click", function() {
        loadMyBranches(CurrentPage + 1);
    });
</script>
  

  

