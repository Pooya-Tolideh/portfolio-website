//Ineractive Skills Menu

(function () {
    var skills = document.querySelectorAll('.c-skill-cat');
    var profile = document.querySelector('.m-sidebar__profile-desc');
    var contacts = document.getElementById('c-social--sidebar');


    function getCatItem(target) {
        //checking if the clicked items is not __tab element already
        if (target.className !== 'c-skill-cat__tab') {
            //check the tag names
            //this is for the svg problem
            if (target.tagName === 'rect') {
                return target.parentNode.parentNode.parentNode;
            } else if (target.tagName === 'g') {
                return target.parentNode.parentNode;
            } else {
                return target.parentNode;
            }
        } else {
            return target;
        }
    }

    function rotate(el, state) {
        if (state === 'close') {
            el.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
            el.querySelector('svg').style.transform = 'rotate(45deg)';
        }
    }

    function togglePod(pod) {
        if (pod.className.indexOf('c-skill-cat__pod--isClosed') !== -1) {
            pod.className = 'c-skill-cat__pod-wrapper';
        } else {
            pod.className += ' c-skill-cat__pod--isClosed';
        }
        console.log(pod.className);
    }

    function toggleProfile() {
        if (profile.className.indexOf('m-sidebar__profile--isHidden') !== -1) {
            profile.className = 'm-sidebar__profile-desc';
        } else {
            profile.className += ' m-sidebar__profile--isHidden';
        } 
    }

    function toggleContacts(amount) {
        contacts.style.opacity = amount;
    }



    function closeOthers() {
        //get all the tabs
        var skillTabs = document.querySelectorAll('.c-skill-cat__pod-wrapper');

        function closeIt(tab) {
            //close that pod
            togglePod(tab);
            //turn back its icon
            rotate(tab.parentNode, 'close');
        }
        
        for (var j = 0; j < skillTabs.length; j++){
            //check to see if any pod is already open
            if (skillTabs[j].className.indexOf('c-skill-cat__pod--isClosed') === -1) {
                closeIt(skillTabs[j]);
            } 
        }
    }


    function openTab(skillCat, pod){
        //If the pod is closed
        // loop through all the pods
        closeOthers(); 
        // disappear contacts when the pod opens
        toggleContacts(0);
        // rotate the icon for the selected pod
        rotate(skillCat);
        // remove isClosed classname
        togglePod(pod);
        // hide the profile and set its height to zero
        // this is so the skill section is pulled up and more room is created
        toggleProfile();
    }

    function closeTab(skillCat, pod) {
        //if yes, turn back the icon
        rotate(skillCat, 'close');
        // add isClosed class to remove pod
        togglePod(pod);
        // bring back the profile section
        toggleProfile();
        // bring back the contacts
        toggleContacts(1);
    }

    function onClick(skill) {
        skill.addEventListener('click', function(e){        
            //get the parent of clicked element
            var skillCat = getCatItem(e.target);
            //once the parent element is determined get the pod
            var pod = skillCat.parentNode.querySelector('.c-skill-cat__pod-wrapper');

            //check to see if the pod is already open
            if (pod.className.indexOf('c-skill-cat__pod--isClosed') === -1) {
                //if open, close the tab
                closeTab(skillCat, pod);
            } else {
                openTab(skillCat, pod);
            }
        });
    }

    //loop through and add an event listener bubble to every category
    for (var i = 0; i < skills.length; i++){ 
        //add the event handler
        onClick(skills[i]);    
    }
}());
