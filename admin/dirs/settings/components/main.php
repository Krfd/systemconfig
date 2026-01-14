<div class="row g-2">

	<!-- User profile -->
	<div class="col-md-6">
	    <div class="card shadow-sm">
	        <!-- Background image section -->
	        <div class="position-relative">
	            <div class="bg-gradient-secondary" 
	                 style="height: 250px;  position: relative;">
	                <button class="btn btn-light position-absolute top-0 end-0 m-2" onclick="uploadBgProfile()">
	                    <i class="bi bi-camera"></i>
	                </button>
	            </div>

	            <!-- Profile image -->
	            <div class="d-flex align-items-start position-absolute top-100 start-0 translate-middle-y ms-3">
	                <img src="../assets/image/logo/noimage.avif" id="my-profile" class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover; cursor: pointer;" alt="Profile" onclick="showProfile()">
	                <!-- Upload profile button -->
	                <div class="ms-3 mt-5">
	                    <button class="btn btn-sm btn-primary" onclick="uploadProfile()">
	                        <i class="bi bi-camera"></i>	Upload Profile
	                    </button>
	                </div>
	            </div>
	        </div>

	        <!-- Profile info -->
	        <div class="card-body mt-5">
	            <h3 class="mt-5" id="profile-name"></h3>
	            <p class="text-muted mb-1" id="profile-position"></p>
	            <p class="text-muted" id="my-position"></p>
	            <p class="mb-1">
	                <strong><i class="bi bi-geo-alt-fill text-danger"></i> Address:</strong>
	                <span id="home-address"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-telephone"></i> Contact:</strong>
	                <span id="my-contact"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-envelope-at"></i> Email:</strong>
	                <span id="my-email"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-facebook text-primary"></i> Facebook:</strong>
	                <span id="my-fb"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-globe text-primary"></i> Website:</strong>
	                <span id="my-website"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-chat text-success"></i> Viber:</strong>
	                <span id="my-viber"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-cake2 text-danger"></i> Birthday:</strong>
	                <span id="my-bday"></span>
	            </p>
		        <div class="mt-2 mb-2 justify-content-end d-flex">
		        	<button class="btn btn-sm btn-primary mr-2" type="button" onclick="updateProfile()"><i class="bi bi-gear"></i>	Update Profile</button>
		        	<button class="btn btn-sm btn-secondary" type="button" onclick="updatePassword()"><i class="bi bi-lock"></i>	Change Password</button>
		        </div>
	        </div>
	    </div>
	</div>


	<!-- Business Profile -->
	<div class="col-md-6">
	    <div class="card shadow-sm">
	        <!-- Business banner / background -->
	        <div class="position-relative">
	           	<div class="business-banner position-relative" style="height: 250px; border-radius: 16px 16px 0 0; overflow: hidden;">
	           	    <!-- Background image as img -->
	           	    <img id="business-bg-img" src="#" 
	           	         alt="Business Background" 
	           	         style="width: 100%; height: 100%; object-fit: cover;">
	           	    
	           	    <!-- Upload background button -->
	           	    <button class="btn btn-light position-absolute top-0 end-0 m-2" 
	           	            title="Upload Business Photo" 
	           	            onclick="uploadBusinessBg()">
	           	        <i class="bi bi-camera"></i>
	           	    </button>
	           	</div>


	            <div class="d-flex align-items-start position-absolute top-100 start-0 translate-middle-y ms-3">
	                <img src="../assets/image/logo/noimage.avif" id="my-b-logo" class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover; cursor: pointer;" alt="Profile" onclick="showLogo()">
	                <!-- Upload profile button -->
	                <div class="ms-3 mt-5">
	                    <button class="btn btn-sm btn-primary" onclick="updBusinessLogo()">
	                        <i class="bi bi-camera"></i>	Upload Profile
	                    </button>
	                </div>
	            </div>
	        </div>

	        <!-- Business info -->
	        <div class="card-body">
	            <h2 class="mt-5" id="business-name">Bo's Café</h2>
	            <p class="text-muted mb-1" id="business-type"></p>

	            <p class="mb-1">
	                <strong><i class="bi bi-person"></i> Owned by:</strong>
	                <span id="business-owner"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-geo-alt-fill text-danger"></i> Address:</strong>
	                <span id="business-address"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-building"></i> Industry:</strong>
	                <span id="business-industry"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-flag text-danger"></i> Established:</strong>
	                <span id="business-est"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-briefcase"></i> TIN:</strong>
	                <span id="business-tin"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-briefcase"></i> Business Permit:</strong>
	                <span id="business-permit"></span>
	            </p>
	            <p class="mb-1">
	                <strong><i class="bi bi-person-raised-hand text-info"></i> Services:</strong>
	                <span id="business-services"></span>
	            </p>
	            <div class="mt-2 mb-2 justify-content-end d-flex">
	            	<button class="btn btn-sm btn-primary" type="button" onclick="updateBusiness()">Update Business Profile</button>
	            </div>
	        </div>
	    </div>
	</div>
</div>
	          