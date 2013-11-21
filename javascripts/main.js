(function() {

  var boys = [
        'Miles',
        'Noah',
        'Elliot',
        'Eben',
        'Isaiah',
        'Tobey',
        'Caleb'
      ],
      events = [],
      races = [];

  var Event = function(type) {
    this.races = [];
    this.type = type;
    this.racers = _.shuffle(boys);
    this.$el = $();
    this.teamSize = (type == 'duel') ? 1 : Math.round(this.racers.length / 2);
  };

  Event.prototype = {
    addRace: function() {
      var race = new Race(event.type, this.selectRacers());
      this.races.push(race);
      race.$el = $(raceTemplate({ race: race, raceNum: this.races.length }));
      $('.races', this.$el).prepend(race.$el);
    },
    selectRacers: function() {
      var teams = [[], []],
          teamSize = this.teamSize;
      _.each(teams, function(team, i) {
        if (!this.racers.length) {
          var racers = _.shuffle(boys);
          this.racers = (i === 0) ? racers : _.difference(racers, team[0]);
        }
        while (team.length < teamSize && this.racers.length) {
          team.push(this.racers.splice(0, 1)[0]);
        }
      }, this);
      return teams;
    }
  };

  var Race = function(type, teams) {
    this.type = type;
    this.teams = teams;
    this.$el = $();
  };

  var $controls = $('#controls'),
      $type = $(':radio', $controls),
      $eventArea = $('#event');

  var eventTemplate = _.template($('#event-template').html()),
      raceTemplate = _.template($('#race-template').html());

  function setup() {
    $controls.on('click', 'button', function(e) {
      e.preventDefault();
      switch(e.target.id) {
        case 'new-event':
          addEvent();
          break;
        case 'new-racer':
          addRacer();
          break;
      }
    });
    $eventArea.
      on('click', '#new-race', addRace).
      on('click', '#timer', toggleTimer);
  }

  function addEvent() {
    var e = new Event($type.filter(':checked').val());
    events.push(e);
    e.$el = $(eventTemplate({ event: e }));
    $eventArea.html(e.$el);
  }

  function addRacer() {
    var $name = $(':text[name=new-racer-name]'),
        name = $name.val();
    if (name) {
      boys.push(name);
      $name.val('');
    }
  }

  function addRace() {
    events[events.length - 1].addRace();
  }

  function toggleTimer(e) {
    var $button = $(e.target),
        start = Date.parse(new Date());
    if ($button.hasClass('start')) {
      $button.removeClass('start').addClass('stop').text('STOP');
    } else if ($button.hasClass('stop')) {
      $button.removeClass('stop').text('DONE');
    }
  }

  window.Rally = {
    setup: setup
  };

})();