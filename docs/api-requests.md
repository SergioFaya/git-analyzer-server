# Requests used

## Get which organizations or account the application is intalled into

* https://api.github.com/app/installations
* Authorization Bearer AUTH_TOKEN
* Accept application/vnd.github.machine-man-preview+json

```nodejs
superagent.get('https://api.github.com/app/installations')
    .set("Accept", "application/vnd.github.machine-man-preview+json")
    .set("Authorization", "Bearer " + token)
    .then(result=>{
        console.log(result.body);
    }).catch(err=>{

    });
```

## Get the repos of authenticated user (visibility, private, public, all ...)

(params=private en el posteman)
* https://api.github.com/user/repos?visibility=private 
* Accept application/vnd.github.machine-man-preview+json
* Authorization token 4eeb5cb03d4a0f2e13c3f7abcc5670a5f67b4534  

## Get the organizations of the authenticated user

https://api.github.com/user/orgs

* Accept application/vnd.github.machine-man-preview+json
* Authorization token 4eeb5cb03d4a0f2e13c3f7abcc5670a5f67b4534  

