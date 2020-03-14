'use strict';

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('onChatMessage', chatMessageEventArg => {
      console.log(JSON.stringify(chatMessageEventArg));

      if (chatMessageEventArg.hasCommand) {
        return;
      }

      if (
        chatMessageEventArg.sanitizedMessage &&
        chatMessageEventArg.sanitizedMessage.length > 0 &&
        chatMessageEventArg.user &&
        chatMessageEventArg.user.login == 'b3_bot'
      ) {
        return;
      }

      var id = +new Date();

      /*
       * chatMessage
       *   body
       *     profile
       *     message
       *   user
       */

      var newChatMessage = createChatDiv('chatMessage');
      newChatMessage.id = 'msg' + id.toString();

      var profile = createChatDiv('profile');
      var profileImg = document.createElement('img');
      profileImg.src = chatMessageEventArg.user.profile_image_url;
      profile.append(profileImg);

      var message = createChatDiv('message');
      message.innerHTML = chatMessageEventArg.sanitizedMessage;

      var body = createChatDiv('body');
      body.append(profile);
      body.append(message);

      var user = createChatDiv('user');
      var name = createChatDiv('name');
      name.innerText =
        chatMessageEventArg.user.display_name || chatMessageEventArg.user.login;
      user.append(name);

      newChatMessage.append(body);
      newChatMessage.append(user);

      var bubble = createChatDiv('bubble');

      // If this chat message is from the bot then handle it separately from
      // all other skins
      if (chatMessageEventArg.user.login === 'b3_bot') {
        newChatMessage.classList.add('bot');
      }

      if (
        chatMessageEventArg.userstate.mod === true ||
        (chatMessageEventArg.userstate.badges &&
          chatMessageEventArg.userstate.badges.broadcaster)
      ) {
        newChatMessage.classList.add('moderator');
      }

      if (chatMessageEventArg.userstate.bits > 0) {
        newChatMessage.classList.add('bits');
      }

      $('#msg' + id).hide();
      $('.chatBox').append(newChatMessage);

      // animateCSS(newChatMessage, 'zoomInUp', null);
      calcPositions();

      $('#msg' + id).fadeIn('slow');

      // setTimeout(
      //   function(id) {
      //     $('#msg' + id).fadeOut('slow', () => {
      //       $('#msg' + id).remove();
      //     });
      //   },
      //   50000,
      //   id
      // );
    });
  });

function createChatDiv(cssClass) {
  var newDiv = document.createElement('div');
  newDiv.classList.add(cssClass);
  return newDiv;
}

function calcPositions() {
  var nextBottom = 0;
  var transparency = 100;

  // Calc bottoms & remove any divs that need
  $(
    $('.chatBox .chatMessage')
      .get()
      .reverse()
  ).each(function(i, el) {
    transparency = (nextBottom / 100) * 7;

    if (transparency > 0 && 1 - transparency / 100 < 0.5) {
      $(el).remove();
    } else {
      nextBottom = nextBottom + $(el).height() + 25;
    }
  });

  nextBottom = 0;
  transparency = 100;

  // Iterate through remainder and move/add
  $(
    $('.chatBox .chatMessage')
      .get()
      .reverse()
  ).each(function(i, el) {
    transparency = (nextBottom / 100) * 7;

    animateCSS(el, 'bounce', null);
    $(el)
      .css('bottom', nextBottom)
      .css({ opacity: 1 - transparency / 100 });
    nextBottom = nextBottom + $(el).height() + 25;
  });
}

function animateCSS(node, animationName, callback) {
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback(node);
  }

  node.addEventListener('animationend', handleAnimationEnd);
}

const shieldSVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path class='strokeColor' d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' /></svg>";
const swordSVG =
  "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0px' y='0px' viewBox='0 0 100 125' enable-background='new 0 0 100 100' xml:space = 'preserve' > <polygon class='strokeColor' points='36.328,63.672 41.64,70.627 90.811,23.947 99.895,0.105 76.053,9.189 29.375,58.359 ' /> <path class='strokeColor' d='M42.741,88.611l4.795-4.793L33.956,66.045L16.183,52.463l-4.794,4.797l11.463,11.463L9.373,82.201  c-2.4-0.109-4.836,0.727-6.67,2.561c-3.461,3.459-3.465,9.072-0.001,12.535c3.464,3.465,9.079,3.465,12.541,0.002  c1.834-1.834,2.665-4.27,2.556-6.67l13.48-13.48L42.741,88.611z' /></svg >";
