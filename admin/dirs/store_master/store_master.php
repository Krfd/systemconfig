<div class="row mb-3 align-items-center">
    <div class="col-md-4 d-flex gap-2">
        <button class="btn btn-success" type="button" onclick="addBranch()">
            <i class="bi bi-plus-lg"></i> Add Branch
        </button>

        <button class="btn btn-secondary" type="button" onclick="loadDrafts()">
            <i class="bi bi-file-earmark"></i> Saved Drafts
        </button>

        <button class="btn btn-danger" type="button" onclick="loadAllBranches()">
            <i class="bi bi-geo-alt"></i> Branches
        </button>
    </div>
    <div class="col-md-4">
    </div>
    <div class="col-md-4 d-flex justify-content-end">
    	<div class="col-md-4">
    	    <select class="form-select" id="filter-branch">
    	        <option selected disabled>Branch</option>
    	    </select>
    	</div>
        <input type="search" name="search-branch" id="search-branch" class="form-control w-75" placeholder="Search...">
    </div>
</div>

<!-- Used for showing branch profile -->
<input type="hidden" id="latitude">
<input type="hidden" id="longitude">

<div id="load_Branchsetup" class=""></div>


<!--Display branches map -->
<div id="map-branches" class="container-fluid"></div>

<script src="dirs/store_master/script/store_master.js"></script>


<?php include 'modal.php';  ?>


<style>
   #map-branches {
       height: 80vh;  /* 80% of viewport height */
       width: 100%;
       padding: 0;    /* optional to remove extra spacing */
       margin: 0;     /* optional */
   }
</style>