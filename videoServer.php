<?php



var_dump($_FILES);

if(move_uploaded_file($_FILES['blobFile']['tmp_name'], 'streamed_video.mp4')){
echo "File is valid, and was successfully uploaded.\n";
    } else {
        echo "Upload failed";
    }
    ?>