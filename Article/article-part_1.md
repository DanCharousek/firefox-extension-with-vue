# Firefox extension with VueJS - Part 1

In this article I'd like to show you how to create very simple firefox extension using popular JavaScript framework VueJS.

This article is divided into two parts. The first part covers all the necessary basics of creating a firefox extension and the second one focuses on the process of converting it to VueJS.

## Prerequisites
Even though no advanced Vue technics are used through out the article and a knowledge of JavaScript should be sufficient, It's recommend for the reader to have at least basic understanding of Vue.

## Table of contents
* [Creating a firefox extension](#creating-a-firefox-extension)
* [Installing](#installing)
* [Do something](#do-something)

## Creating a firefox extension
In nutshell firefox extension is a directory that contains some files. That's all it is. It might not sound technical at all, but bare with me, I'll get to that later on.

So with that in mind, let's create a new directory called `MyExtension` and enter it.

    mkdir MyExtension
    cd MyExtension

A firefox extension might contain lot of other directories and files, but some of them are optional and in some cases you might not need them at all.

So let's talk about the mandatory ones. Actually, I should say the mandatory one. The only required file for firefox extension is `manifest.json` which should be located in the root directory of our extension. So let's create one

    touch manifest.json

and fill it with following json object:

    {
        "manifest_version": 2,
        "name": "MyExtension",
        "version": "1.0.0"
    }

This is the smallest working configuration for a firefox extension to work. As you can guess, it's not very useful at the moment, but it's a good start.

I hope each property in the `manifest.json` file is self-explanatory, but just to be sure, here's quick overview:

* **manifest_version** - Indicates the version of manifest file itself. For more details visit Mozilla's documentation.
* **name** - This is how we named our extension
* **version** - This is a string that indicates current version of our extension. You can name it whatever you want, but there are some conventions that you can follow. For more information see [Semver](https://semver.org).

Right now our whole project looks like this.

![Project structure after initial setup](img/init_project_structure.png)

Before we extend it with more functionality, let's take a look at how to install and debug such extension.

## Installing

First, we need to open a debugging page. Into an URL bar in firefox enter `about:debugging` and hit enter. You should get something similar to this:

![Firefox debugging page](img/debugging_page.png)

Click the *Load Temporary Add-on* button and open your `manifest.json` file. Now you should see your extension loaded in the *Temporary Extensions* section.

![Temporary extension section](img/extension_loaded.png)

## Do something

Now you've successfully managed to create and temporary load a firefox extension. Even though It's a great accomplishment and something to be proud of let's be real here. It's useless.

![Sad extension](img/sad_extension.png)

It does not look anyhow, it does not do anything, it just sits there taking resources (almost nothing, but that's not the point).

So let's fix that "not look anyhow" part. And by that, I mean let's give our extension a way to present itself to the world - an icon.

### Providing the extension with an icon

I don't have any good candidates for an icon with me at the moment, but I've found and image of me that I often use, so I am gonna go with this one. I hope you'll forgive me someday. Of course you are free to use any picture you like.

Let's create a folder where our images and later on most of the application source code will live.

    mkdir -p assets/img

The `-p` option says that the command should create all directories on the path in case they do not exist. So in this case it will create an `asset` directory and `img` directory within it. Put your chosen icon image in the `img` folder and you're good to go.

Our project now looks like this

    MyExtension
        assets/
            img/
                logo.png
        manifest.json

If you hit the *reload* button in the `about:debugging` page, you'll notice that nothing happens. To actually tell the extension to use our image as an icon we need to tell it explicitly. To do so, let's update our `manifest.json` file.

The key property for specifying icons is, you'd never guess, a property called `icons`. It is an object where key is dimensions of the icon and the value is path to it. You can read more about it [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons).

    {
        "manifest_version": 2,
        "name": "MyExtension",
        "version": "1.0.0",
        "icons": {
            "48": "assets/img/logo.png"
        }
    }

Now if you hit the reload button, instead of the default extension icon (the puzzle piece) the one you provided should appear.

Now it's got some look so we can finally show it to the friends. But it still does nothing much. So you know what, better don't show it to anyone yet...

Instead of that, let's take a look at how to actually make our extension somehow useful.

### Browser action

We want to allow users to somehow interact with our extension. Browser action is the little button in top right corner of your browser which usually opens a small popup that let you do stuff. Let's take a look at how to create one.

![Browser actions](img/browser_actions.png)

The popup that is opened once you click the button is simple html page so before we create the button, let's prepare simple HTML page called `app.html` for that purpose.

    touch app.html

and fill it with

    <!DOCTYPE html>
    <html>  
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        Hello Firefox extension!
    </body>
    </html>

Now we need to register this html as a default popup in `manifest.json`.

    {
        "manifest_version": 2,
        "name": "MyExtension",
        "version": "1.0.0",
        "icons": {
            "48": "assets/img/logo.png"
        },
        "browser_action": {
            "default_icon": "assets/img/logo.png",
            "default_title": "Opens MyExtension",
            "default_popup": "app.html"
        }
    }

Pay attention to the *browser_action* property which describes the default popup. Note that I've used the same image as a extension logo and popup icon. These two can differ but I decided to do so to limit number of images used in the demo app.

*Default title* is the text that is shown when user hovers over the button and *default popup* is our html that is used as the popup. You can read more about browser action in [official docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action).

Go ahead, reload your extension in `about:debugging` and you should now see the button.

![Custom popup](img/popup_usage.png)

Congrats, you've successfully created first functional firefox extension and this time, it even does something.

### Requesting the permissions

Before we dig into converting our extension to VueJS we need to improve it just a little bit. This article is not mainly focused on what kind of things you can do with your extension, but I think it's useful to demonstrate at least some things it can do. Let's take advantage of the extension ability to access some browser information which are not available in regular html page - accessing opened window and getting all of it's opened tabs.

To do so, we need to explicitly ask for an access to browser tabs and it need to be granted to us by user. That's usually done during the installing process where user is asked if they agree with granting the permission to the extension.

As you might guess, this again takes place in `manifest.js`. This time it's property called *permissions* and it holds an array of all permissions requested by the extension. So go ahead and put `tabs` in that array.

    {
        "manifest_version": 2,
        "name": "MyExtension",
        "version": "1.0.0",
        "icons": {
            "48": "assets/img/logo.png"
        },
        "browser_action": {
            "default_icon": "assets/img/logo.png",
            "default_title": "Opens MyExtension",
            "default_popup": "app.html"
        },
        "permissions": ["tabs"]
    }

Now, when you try to install the extension you will get prompted to confirm to grant the permission the extension asks. Well, actually you won't get prompted with anything since we are in debugging mode, but trust me, it will be there.

### Add some interactivity

Now it's time to receive and process some data. We will take advantage of the *tabs* permission that was granted to us and access it through the `browser` object.

But before that, let's create a button in `app.html` that will trigger an event and an `ul` element that will show the results.

    ...
	<body>
        Hello Firefox extension!
        <button id="button">Show me tabs</button>
        <ul id="results"></ul>
	</body>
    ...

Now we need to create `loadTabs()` function and register it as an onlick listener. So let's create a file called `app.js` and put it in the root folder of our extension register the function and link it in the `app.html`.

    ...
	<body>
        Hello Firefox extension!
        <button id="button">Show me tabs</button>
        <ul id="results"></ul>

        <script src="app.js"></script>
	</body>
    ...

And finally the `app.js`

    const btn = document.querySelector('#button');
    btn.addEventListener('click', loadTabs);

    function loadTabs() {
        alert('Hello there!');
    }

Reload the extension and try to hit the button if it properly shows an alert window. You should get something similar to this:

![Triggering an event](img/triggering_an_event.png)

Last thing to do is to remove the call of the `alert` function and replace it with actual request to browser to get all opened tabs:

    const btn = document.querySelector('#button');
    btn.addEventListener('click', loadTabs);

    function loadTabs() {
        // This is the request to obtain an array of active tabs. It returns a promise.
        // It accepts a config object (see docs)
        browser.tabs.query({ currentWindow:true })
            .then(tabs => {
                const results = document.querySelector('#results');
                results.innerHTML = '';
                for (let tab of tabs) {
                    results.innerHTML += `<li>${tab.title}: ${tab.url}</li>`;
                }
            });
    }

Now, after clicking the button, you should see all tabs listed in the unordered list. Congrats!

Let me show you one last thing before wrapping up the first part of this article.

### Popup debugging

There will definitely be times when you will need to inspect elements of your popup window (an html document) as a regular html page. For these purposes there is a button *Debug* right next to `Reload` button in the *Temporary Extensions* section. This is no secret since the button is pretty well visible. But once you get to debugging, you'll notice that once you click the inspector window to play around with the elements, your popup gets closed. This is very inconvenient, but fortunately there is a fix to it.

Click the three dots button on the very top right corner of the inspection window and hit *Disable popup auto-hide*.

![Disable popup auto-hide](img/popup_debugging.png)

And that's all to the first part. I thank you very much  if you managed to read through out the article all the way down here.

This article is published on [Github]() as an opensource project, so if you have any recommendations, or found any typo or mistake, do not hesitate contributing. Only if you want, of course.