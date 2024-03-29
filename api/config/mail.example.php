 <?php
 return [
         'driver' => env('MAIL_DRIVER', 'smtp'),
     
         'host' => env('MAIL_HOST', 'smtp.gmail.com'),
     
         'port' => env('MAIL_PORT', 587),
     
         'from' => [
                 'address' => env('MAIL_FROM_ADDRESS', 'mail@example.com'),  // <------
                 'name' => env('MAIL_FROM_NAME', 'Eventees'),
             ],
     
     
         'encryption' => env('MAIL_ENCRYPTION', 'tls'),
     
         'username' => env('MAIL_USERNAME', 'email@example.com'),        // <------
         'password' => env('MAIL_PASSWORD', 'haslo'),                    // <------
     
         'sendmail' => '/usr/sbin/sendmail -bs',
     
         'markdown' => [
                 'theme' => 'default',
                 'paths' => [
                         resource_path('views/vendor/mail'),
                     ],
             ],
     
         'log_channel' => env('MAIL_LOG_CHANNEL'),
     ];