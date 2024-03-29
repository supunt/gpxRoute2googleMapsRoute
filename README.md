# GpxToGoogleMaps

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## What does this do ?
This takes a gpx v1.1 file process it and gives you a route (or segments if you have more than 25 waypoint in your route) that you can copy and open via google maps

You get a pre-render if the route. \
You can copy the link tgat it generates and open in a new browser tab to use fully on google maps

## How does it work ?
The madness that went in to this is documented in the link below \
https://medium.com/@supun1001/how-to-generate-google-embed-links-programmatically-for-iframes-for-routes-only-d6dc225e59e8

## Hosting Documentation
https://www.hostingadvice.com/how-to/install-phpmyadmin-on-ubuntu/
https://www.vultr.com/docs/install-a-lamp-stack-on-ubuntu-20-04-lts
https://www.vultr.com/docs/how-to-install-apache-mysql-and-php-on-ubuntu-18-04
https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-16-04
https://www.thepolyglotdeveloper.com/2015/01/run-nodejs-application-lamp-stack-server/

## SSR Deploymnet
* npm install to restore packages
* npm run build:ssr
* copy dist folder to destination [from dist folder `scp -r ./* <dest_user>@<host>:~/<drop_location>`]

## Server setup for SSR
* Install NVM
* Install Node
* Install npm
* Install PM2

## SSL Instructions
* Download SSL files
* `/etc/apache2/sites-available/https.conf` - check instructions

    ```
    <IfModule mod_ssl.c>
        <VirtualHost _default_:443>

            <Directory /var/www/html/>
                Options -Indexes
                Require all granted
            </Directory>

            <Files ".ht*">
                Require all denied
            </Files>

            #ServerAdmin webmaster@example.com
            #ServerName host.example.com

            DocumentRoot /var/www/html

            SetEnvIf Request_URI "^/favicon\.ico$" dontlog
            SetEnvIf Request_URI "^/robots\.txt$" dontlog

            ErrorLog ${APACHE_LOG_DIR}/error.log
            CustomLog ${APACHE_LOG_DIR}/access.log combined

            DirectoryIndex index.php index.html

            SSLEngine on
            # SSLCertificateFile      /etc/apache2/ssl/server.crt
            # SSLCertificateKeyFile   /etc/apache2/ssl/server.key
            SSLCertificateFile /root/.server_keys/gpx2googlemaps.com.crt
            SSLCertificateKeyFile /root/.server_keys/gpx2googlemaps_com.key

            # Ubuntu default: Enable StdEnvVars
            <FilesMatch "\.(cgi|shtml|phtml|php)$">
                    SSLOptions +StdEnvVars
            </FilesMatch>
            <Directory /usr/lib/cgi-bin>
                    SSLOptions +StdEnvVars
            </Directory>

        </VirtualHost>
    </IfModule>
    ```
* `sudo service apache2 restart`

