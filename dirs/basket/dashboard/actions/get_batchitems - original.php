  <?php
    require_once "../../../../config/connection.php";
    session_start();

    $User = $_SESSION['Uid'];
    $BatchNumber = $_POST['BatchNumber'] ?? [];

    try {

        $conn->beginTransaction();
        if (!is_array($BatchNumber)) {
            $BatchNumber = [$BatchNumber];
        }

        $results = [];
        $stmt = $conn->prepare("EXEC dbo.[Assigned_ItemsQuantity] ?,?");
        foreach ($BatchNumber as $number) {
            $stmt->execute([$User, $number]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($data) {
                $results[] = $data;
            }
        }

        $conn->commit();

        echo json_encode([
            "isSuccess" => "success",
            "Data" => $results
        ]);
    } catch (PDOException $e) {

        $conn->rollback();

        echo json_encode([
            "isSuccess" => "Failed",
            "Data" => "Error. Please contact system developer."
        ]);
    }
    ?>