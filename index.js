class Game {
  constructor() {
    this.field = document.querySelector('.field');
    this.tiles = []; // Массив тайлов
    this.generateMap();
    this.generateRooms();
    this.generatePassages();
    this.generateItems();
    this.placeHero();
    // this.placeEnemy();
    // this.heroPosX = 0;
    // this.heroPosY = 0;
    this.moveHero();
    console.log(this.tiles);
    console.log(this.field);
    this.heroAttack = 20; // Сила атаки героя
    this.heroHealth = 100; // Здоровье героя
    this.enemyHealth = 100; // Здоровье противников
    this.swordsCollected = 0;
    document.addEventListener('keydown', this.handleSpacebar.bind(this));
  }

  generateMap() {
    var field = document.querySelector('.field');
    var tile = document.createElement('div');
    tile.classList.add('tileW');

    for (var row = 0; row < 24; row++) {
      for (var col = 0; col < 40; col++) {
        var tileClone = tile.cloneNode();
        tileClone.style.top = row * 50 + 'px';
        tileClone.style.left = col * 50 + 'px';

        // Проверяем, является ли текущий тайл стеной
        if (this.isWallTile(row, col)) {
          tileClone.classList.add('tileW');
        }
        field.appendChild(tileClone);
        this.tiles.push(tileClone);
      }
    }
  }
  isWallTile(row, col) {}

  generateRooms() {
    var numRooms = Math.floor(Math.random() * 6) + 5;

    for (var i = 0; i < numRooms; i++) {
      var roomWidth = Math.floor(Math.random() * 6) + 3;
      var roomHeight = Math.floor(Math.random() * 6) + 3;
      var startX = Math.floor(Math.random() * (40 - roomWidth));
      var startY = Math.floor(Math.random() * (24 - roomHeight));

      for (var row = startY; row < startY + roomHeight; row++) {
        for (var col = startX; col < startX + roomWidth; col++) {
          var tile = this.tiles[row * 40 + col];

          if (tile) {
            tile.classList.remove('tileW');
            tile.classList.add('tile');
          }
        }
      }
    }
  }

  generatePassages() {
    var numPassages = Math.floor(Math.random() * 6) + 5;

    for (var i = 0; i < numPassages; i++) {
      var isVertical = Math.random() < 0.5;

      if (isVertical) {
        var posX = Math.floor(Math.random() * 40);

        for (var row = 0; row < 24; row++) {
          var tile = this.tiles[row * 40 + posX];

          if (tile) {
            tile.classList.remove('tileW');
            tile.classList.add('tile');
          }
        }
      } else {
        var posY = Math.floor(Math.random() * 24);
        for (var col = 0; col < 40; col++) {
          var tile = this.tiles[posY * 40 + col];

          if (tile) {
            tile.classList.remove('tileW');
            tile.classList.add('tile');
          }
        }
      }
    }
  }

  generateItems() {
    // Размещение героя
    this.placeHero('images/tile-P.png', 'tileP', 'tile');
    // Размещение мечей
    var numSwords = 2;
    for (var i = 0; i < numSwords; i++) {
      this.placeItem('images/tile-SW.png', 'tileSW', 'tile');
    }
    // Размещение зелий здоровья
    var numHealthPotions = 10;
    for (var i = 0; i < numHealthPotions; i++) {
      this.placeItem('images/tile-HP.png', 'tileHP', 'tile');
    }
    // Размещение противников
    var numEnemy = 10;
    for (var i = 0; i < numEnemy; i++) {
      this.placeItem('images/tile-E.png', 'tileE', 'tile');
    }
  }

  placeItem(imageUrl, className, requiredClass) {
    var availableTiles = this.tiles.filter(function (tile) {
      return tile.classList.contains(requiredClass);
    });

    if (availableTiles.length === 0) {
      console.error('Недостаточно доступных тайлов с требуемым классом.');
      return;
    }

    var randomTileIndex = Math.floor(Math.random() * availableTiles.length);
    var tile = availableTiles[randomTileIndex];

    tile.classList.remove('tile');
    tile.classList.add(className);
  }

  placeHero(imageUrl, className, requiredClass) {
    var availableTiles = this.tiles.filter(function (tile) {
      return (
        tile.classList.contains(requiredClass) &&
        !tile.classList.contains(className)
      );
    });

    if (availableTiles.length === 0) {
      console.error('Недостаточно доступных тайлов с требуемым классом.');
      return;
    }

    var randomTileIndex = Math.floor(Math.random() * availableTiles.length);
    var tile = availableTiles[randomTileIndex];

    tile.classList.remove('tile');
    tile.classList.add(className);
    if (className === 'tileE') {
      // Добавляем класс 'health' только для противников
      tile.classList.add('health');
    }

    if (this.heroTile && this.heroTile !== tile) {
      this.heroTile.classList.remove(className);
      this.heroTile.classList.remove('tileP');
      this.heroTile.classList.remove('health');
      this.heroTile.classList.add('tile');
      this.heroTile.classList.add('health');
    }

    this.heroTile = tile;
    this.heroPosX = parseInt(tile.style.left) / 50;
    this.heroPosY = parseInt(tile.style.top) / 50;
  }

  healHero(potionTile) {
    this.heroHealth += 20;
    potionTile.classList.remove('tileHP');
    potionTile.classList.remove('health');
    potionTile.classList.add('tile');
    console.log(this.heroHealth);
  }

  // placeEnemy(imageUrl, className, requiredClass) {
  //   var availableTiles = this.tiles.filter(function (tile) {
  //     return tile.classList.contains(requiredClass);
  //   });

  //   if (availableTiles.length === 0) {
  //     console.error('Недостаточно доступных тайлов с требуемым классом.');
  //     return;
  //   }

  //   for (var i = 0; i < 10; i++) {
  //     var randomTileIndex = Math.floor(Math.random() * availableTiles.length);
  //     var tile = availableTiles[randomTileIndex];

  //     tile.classList.remove('tile');
  //     tile.classList.add(className);
  //     //tile.style.backgroundImage = 'url("' + imageUrl + '")';
  //     //tile.style.zIndex = 8; // Устанавливаем z-index равным 10

  //     // Удаляем использованный тайл из доступных тайлов, чтобы противники не размещались на одном и том же тайле
  //     availableTiles.splice(randomTileIndex, 1);

  //     if (availableTiles.length === 0) {
  //       console.warn(
  //         'Доступные тайлы закончились. Размещено меньше противников.'
  //       );
  //       break;
  //     }
  //   }
  // }

  // moveHero(direction) {
  //   let newPosX = this.heroPosX;
  //   let newPosY = this.heroPosY;

  //   switch (direction) {
  //     case 'up':
  //       newPosY -= 1;
  //       break;
  //     case 'left':
  //       newPosX -= 1;
  //       break;
  //     case 'down':
  //       newPosY += 1;
  //       break;
  //     case 'right':
  //       newPosX += 1;
  //       break;
  //     default:
  //       return;
  //   }

  //   this.tryMoveHeroTo(newPosX, newPosY);
  // }

  // tryMoveHeroTo(newPosX, newPosY) {
  //   if (newPosX >= 0 && newPosX < 40 && newPosY >= 0 && newPosY < 24) {
  //     var newTile = this.tiles[newPosY * 40 + newPosX];
  //     if (
  //       newTile.classList.contains('tile') ||
  //       newTile.classList.contains('tileW')
  //     ) {
  //       var currentTile = this.tiles[this.heroPosY * 40 + this.heroPosX];
  //       currentTile.classList.remove('hero');
  //       newTile.classList.add('hero');
  //       this.heroPosX = newPosX;
  //       this.heroPosY = newPosY;
  //     }
  //   }
  // }

  init() {
    this.addEventListeners();
    this.moveEnemiesRandomly();
  }

  addEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keydown', this.handleSpacebarPress.bind(this));
  }

  handleSpacebarPress(event) {
    if (event.code === 'Space') {
      var heroIndex = this.tiles.indexOf(this.heroTile);

      // Проверяем клетки вокруг героя на наличие противников
      var nearbyTiles = [
        this.tiles[heroIndex - 40], // Верхняя клетка
        this.tiles[heroIndex + 40], // Нижняя клетка
        this.tiles[heroIndex - 1], // Левая клетка
        this.tiles[heroIndex + 1], // Правая клетка
      ];

      for (var i = 0; i < nearbyTiles.length; i++) {
        var nearbyTile = nearbyTiles[i];

        if (nearbyTile && nearbyTile.classList.contains('tileE')) {
          this.attackEnemy(nearbyTile);
          break; // Если атака выполнена, выходим из цикла
        }
      }
    }
  }

  handleKeyDown(event) {
    var key = event.key;
    var heroIndex = this.tiles.indexOf(this.heroTile);

    // Определяем новую позицию героя на основе нажатой клавиши
    var newHeroIndex;
    if (key === 'w' || key === 'W' || key === 'Ц' || key === 'ц') {
      newHeroIndex = heroIndex - 40;
    } else if (key === 's' || key === 'S' || key === 'Ы' || key === 'ы') {
      newHeroIndex = heroIndex + 40;
    } else if (key === 'a' || key === 'A' || key === 'Ф' || key === 'ф') {
      newHeroIndex = heroIndex - 1;
    } else if (key === 'd' || key === 'D' || key === 'В' || key === 'в') {
      newHeroIndex = heroIndex + 1;
    }

    // Проверяем, является ли новая позиция клеткой с классом 'tile'
    var newHeroTile = this.tiles[newHeroIndex];
    if (
      newHeroTile &&
      (newHeroTile.classList.contains('tile') ||
        newHeroTile.classList.contains('tileHP') ||
        newHeroTile.classList.contains('tileSW')) &&
      !newHeroTile.classList.contains('tileE')
    ) {
      this.moveHero(newHeroTile); // Перемещаем героя на новую позицию
    }
    // Проверяем, является ли новая позиция соседней клеткой с противником
    if (newHeroTile && newHeroTile.classList.contains('tileE')) {
      this.attackEnemy(newHeroTile); // Атакуем противника
      return; // Выходим из метода, чтобы предотвратить дальнейшее перемещение
    }
    if (newHeroTile && newHeroTile.classList.contains('tileE')) {
      this.enemyAttack(newHeroTile);
      return;
    }
  }

  moveHero(newHeroTile) {
    if (!newHeroTile) {
      return; // Выход из метода, если newHeroTile не определен
    }

    if (newHeroTile.classList.contains('tileHP')) {
      this.healHero(newHeroTile);
      //return; // Выходим из метода, чтобы предотвратить дальнейшее перемещение
      console.log('asdasdasd');
    }

    if (newHeroTile.classList.contains('tileSW')) {
      this.enhanceHero(newHeroTile);
      //return; // Exit the method to prevent further movement
    }

    newHeroTile.classList.add('tileP');
    newHeroTile.classList.remove('tile');
    newHeroTile.classList.add('health');

    if (this.heroTile) {
      this.heroTile.classList.remove('tileP');
      this.heroTile.classList.remove('health');
      this.heroTile.classList.add('tile');
    }

    this.heroTile = newHeroTile;

    if (this.heroTile) {
      var adjacentTiles = this.getAdjacentTiles(this.heroTile);
      for (var i = 0; i < adjacentTiles.length; i++) {
        var adjacentTile = adjacentTiles[i];
        if (adjacentTile && adjacentTile.classList.contains('tileE')) {
          this.enemyAttack(adjacentTile);
        }
      }
    }
  }

  enemyAttack(enemyTile) {
    this.heroHealth -= 20;
    console.log('Герой получил удар! Здоровье героя:', this.heroHealth);
    if (this.heroHealth <= 0) {
      console.log('Герой погиб!');
    }
    //enemyTile.classList.remove('tileE');
    //enemyTile.classList.remove('health');
    enemyTile.classList.add('tile');
  }

  healHero(potionTile) {
    // Ваш код восстановления здоровья героя
    // Например:
    this.heroHealth += 20;
    console.log('Здоровье героя', this.heroHealth);
    potionTile.classList.remove('tileHP');
    potionTile.classList.remove('health');
    potionTile.classList.add('tile');
  }

  enhanceHero(swordTile) {
    this.heroAttack += 20;
    //console.log(this.heroAttack);
    swordTile.classList.remove('tileSW');
    swordTile.classList.remove('sword');
    swordTile.classList.add('tile');
    console.log('Сила атаки героя увеличена!');
  }

  moveEnemiesRandomly() {
    setInterval(() => {
      var enemies = document.getElementsByClassName('tileE');

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        this.moveEnemyRandomly(enemy);
      }
    }, 2000);
  }
  moveEnemyRandomly(enemy) {
    var directions = ['up', 'down', 'left', 'right'];
    var randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    var enemyIndex = this.tiles.indexOf(enemy);
    var newEnemyIndex;

    if (randomDirection === 'up') {
      newEnemyIndex = enemyIndex - 40;
    } else if (randomDirection === 'down') {
      newEnemyIndex = enemyIndex + 40;
    } else if (randomDirection === 'left') {
      newEnemyIndex = enemyIndex - 1;
    } else if (randomDirection === 'right') {
      newEnemyIndex = enemyIndex + 1;
    }

    var newEnemyTile = this.tiles[newEnemyIndex];
    //newEnemyTile.classList.add('health');

    if (
      newEnemyTile &&
      (newEnemyTile.classList.contains('tile') ||
        newEnemyTile.classList.contains('tileHP') ||
        newEnemyTile.classList.contains('tileSW')) &&
      !newEnemyTile.classList.contains('tileP') &&
      !newEnemyTile.classList.contains('tileE')
    ) {
      enemy.classList.remove('tile');
      enemy.classList.remove('tileE');
      enemy.classList.remove('health');
      newEnemyTile.classList.add('tileE');
      newEnemyTile.classList.remove('tile');
      this.tiles[enemyIndex].classList.add('tile'); // Возвращаем предыдущую позицию противника в состояние 'tile'
    }
  }

  handleSpacebar(event) {
    if (event.key === ' ') {
      var heroIndex = this.tiles.indexOf(this.heroTile);
      var adjacentTiles = [
        heroIndex - 40, // Верхняя клетка
        heroIndex + 40, // Нижняя клетка
        heroIndex - 1, // Левая клетка
        heroIndex + 1, // Правая клетка
      ];

      for (var i = 0; i < adjacentTiles.length; i++) {
        var adjacentTile = this.tiles[adjacentTiles[i]];

        if (adjacentTile && adjacentTile.classList.contains('tileE')) {
          this.attackEnemy(adjacentTile);
          break;
        }
      }
    }
  }

  getAdjacentTiles() {
    // Получаем текущую позицию героя
    const heroIndex = this.tiles.indexOf(this.heroTile);
    const heroX = heroIndex % 40;
    const heroY = Math.floor(heroIndex / 40);

    // Проверяем соседние клетки на наличие противников
    const adjacentTiles = [
      [heroX, heroY - 1], // Вверх
      [heroX, heroY + 1], // Вниз
      [heroX - 1, heroY], // Влево
      [heroX + 1, heroY], // Вправо
      [heroX - 1, heroY - 1], // Вверх-влево (диагональ)
      [heroX + 1, heroY - 1], // Вверх-вправо (диагональ)
      [heroX - 1, heroY + 1], // Вниз-влево (диагональ)
      [heroX + 1, heroY + 1], // Вниз-вправо (диагональ)
    ];

    const adjacentTilesArray = [];

    for (const [x, y] of adjacentTiles) {
      if (x >= 0 && x < 40 && y >= 0 && y < 24) {
        const index = y * 40 + x;
        const tile = this.tiles[index];
        adjacentTilesArray.push(tile);
      }
    }

    return adjacentTilesArray;
  }

  collectSword() {
    this.swordsCollected += 1;

    if (this.swordsCollected === 1) {
      this.heroAttack += 40;
    } else if (this.swordsCollected === 2) {
      this.heroAttack += 60;
    }
  }

  attackEnemy() {
    const adjacentTiles = this.getAdjacentTiles();

    // Получаем все соседние клетки, содержащие противников
    const enemyTiles = adjacentTiles.filter((tile) =>
      tile.classList.contains('tileE')
    );
    if (enemyTiles.length > 0) {
      // Атакуем всех противников
      for (const enemyTile of enemyTiles) {
        this.enemyHealth -= this.heroAttack;
        console.log('Здоровье противника', this.enemyHealth);
        if (this.enemyHealth <= 0) {
          // Противник повержен, удаляем его из игрового поля
          enemyTile.classList.remove('tileE');
          enemyTile.classList.remove('health');
          enemyTile.classList.add('tile');
          //this.enemyHealth = 100;
        }
      }
    }
  }
}
