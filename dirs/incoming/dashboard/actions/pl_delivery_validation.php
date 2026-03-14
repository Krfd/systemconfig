<?php

// Validate Pick List Number if Exist then Return
$validatePicklist = $conn->prepare("EXEC dbo.[VALIDATE_PICKLIST_TO_Delivery] ? ,?");
$validatePicklist->execute([$User, $PickListNum]);
if ($validatePicklist->fetchColumn() > 0) {
    $conn->rollBack();
    exit("This Pick List already exists.");
}
