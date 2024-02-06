<?php
$dbConnector = new DatabaseConnector();

class DatabaseConnector
{
    private $login = "(¬‿¬)";
    private $servername = "(¬‿¬)";
    private $username = "";
    private $password = "";
    private $dbname = "(¬‿¬)";
    private $conn;
    private $errorHandler;

    public function __construct()
    {
        $this->errorHandler = new ErrorHandler();

        $this->getLoginData();
        $this->connectDb();
        $this->processRequest();
    }

    //get logindata from file (little bit more secure than saving plain data on github)
    public function getLoginData()
    {
        if (!file_exists($this->login)) {
            $this->errorHandler->createError("Login data file not found! Make sure you have a serialized version on the server.");
            die;
        } else {
            $loginData = unserialize(file_get_contents($this->login));
            $this->username = $loginData["username"];
            $this->password = $loginData["password"];
        }
    }

    //bypass pushing username and password of database to github
    public function setLoginData($username, $password)
    {
        $arr["username"] = $username;
        $arr["password"] = $password;
        $serializedArr = serialize($arr);
        file_put_contents($this->login, $serializedArr);
    }

    public function connectDb()
    {
        try {
            $this->conn = new PDO("mysql:host=" . $this->servername . ";dbname=" . $this->dbname, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (\Throwable $th) {
            $this->errorHandler->createError($th->getMessage());
            die;
        }
    }

    public function processRequest()
    {
        if ($_POST == NULL) {
            print_r("begone!");
            die;
        }
        switch ($_POST["action"]) {
            case 'beat':
                $sql = "SELECT id FROM pagehit WHERE date LIKE '" . date('Y-m-d') . "'";
                $resultId = $this->selectStatement($sql);

                if (count($resultId) == NULL) {
                    $sql = "INSERT INTO pagehit (date, count) VALUES (?, 1)";
                    $arr = [date('Y-m-d')];
                    $this->insertStatement($sql, $arr);
                } else {
                    $sql = "UPDATE pagehit SET count = count+1 WHERE date LIKE ?";
                    $arr = [date('Y-m-d')];
                    $this->insertStatement($sql, $arr);
                }
                break;
            case 'message':
                $sql = "INSERT INTO message (message_text) VALUES (?)";
                $arr = [$_POST["text"]];
                $this->insertStatement($sql, $arr);
                break;
            default:
                # code...
                break;
        }
        die;
    }

    public function insertStatement($sql, $arr)
    {
        $stmt = $this->conn->prepare($sql);
        try {
            $stmt->execute($arr);
            $stmt->closeCursor();
        } catch (\Throwable $th) {
            $this->errorHandler->createError($th->getMessage());
            die;
        }
    }

    public function selectStatement($sql)
    {
        $stmt = $this->conn->prepare($sql);
        try {
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $result;
        } catch (\Throwable $th) {
            $this->errorHandler->createError($th->getMessage());
            die;
        }
    }
}

class ErrorHandler
{

    private $filename = "";
    private $folderName = "(¬‿¬)";
    private $filePath = "";

    public function __construct()
    {

        $this->filename = "dC_log_" . date("d.m.Y") . ".txt";
        $this->filePath = $this->folderName . "/" . $this->filename;

        //check for folder
        if (!is_dir($this->folderName)) {
            mkdir($this->folderName);
        }
        //create log file for current day
        if (!file_exists($this->folderName . "/" . $this->filename)) {
            $handle = fopen($this->folderName . "/" . $this->filename, "w");
            fclose($handle);
        }
    }

    public function createError($errorMessage)
    {
        file_put_contents($this->filePath, date('H:i:s') . " -> \t" . $errorMessage . "\n", FILE_APPEND | LOCK_EX);
        echo $errorMessage;
    }
}