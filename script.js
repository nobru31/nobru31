const themeButtons = document.querySelectorAll('.chip');
const generateButton = document.getElementById('generateButton');
const messageCard = document.getElementById('messageCard');
const messageTheme = document.getElementById('messageTheme');
const messageText = document.getElementById('messageText');
const statusMessage = document.getElementById('statusMessage');
const newButton = document.getElementById('newButton');
const saveButton = document.getElementById('saveButton');
const shareButton = document.getElementById('shareButton');
const favLink = document.getElementById('favLink');
const backButton = document.getElementById('backButton');
const favoritesView = document.getElementById('favoritesView');
const favoritesList = document.getElementById('favoritesList');
const emptyState = document.getElementById('emptyState');
const pageContainer = document.querySelector('.page-container');
const leavesContainer = document.getElementById('leavesContainer');

const messages = {
  autoestima: [
    'Você não precisa ser perfeito para ser suficiente. Você já é.',
    'Cuidar de si mesmo não é egoísmo. É o começo de tudo.',
    'O que você acha de si importa mais do que o que os outros pensam.',
    'Não quero aplausos de uma platéia que fez de tudo para a minha peça não entrar em cena.'
  ],
  confianca: [
    'A incerteza não é o oposto da confiança. É onde ela nasce.',
    'Confie no processo, mesmo quando você não consegue ver o resultado.',
    'Cada passo dado com intenção é um ato de fé em si mesmo.'
  ],
  presenca: [
    'O momento presente é o único lugar onde a vida realmente acontece.',
    'Respirar fundo é uma forma de lembrar que você está vivo agora.',
    'Pause. Olhe ao redor. Isso também é parte da jornada.'
  ],
  coragem: [
    'Coragem não é ausência de medo. É seguir em frente apesar dele.',
    'Você já superou dias difíceis antes. Este não é diferente.',
    'Começar pequeno ainda é começar.'
  ],
  leveza: [
    'Nem tudo precisa fazer sentido. Às vezes é só viver mesmo.',
    'Você não precisa ter as respostas para curtir o caminho.',
    'Rir de si mesmo é a forma mais sábia de levar a vida a sério.',
    'A vida é muito curta para não aproveitar os momentos bobos.',
    'Às vezes a melhor coisa é parar de pensar e apenas estar.'
  ],
  conhecimento: [
    'O conhecimento é o único bem que ninguém consegue tirar de você.',
    'Aprender é abrir portas que você nem sabia que existiam.',
    'Curiosidade é o combustível do crescimento.',
    'Quem lê nunca está realmente sozinho.',
    'O maior erro é achar que você já sabe tudo.',
    'A ciência avança com perguntas, não com certezas.',
    'Informação é poder, mas sabedoria transforma esse poder em ação.',
    'Conhecer outras culturas amplia o seu mapa mental.',
    'Uma ideia nova pode surgir de uma conversa simples.',
    'Pequenos fatos diários constroem um grande repertório.'
  ],
  sabedoria: [
    'Sabedoria é saber quando calar, quando falar e quando agir.',
    'A vida é a melhor professora para quem sabe escutar.',
    'Errar é parte do caminho para acertar.',
    'O tempo revela tudo que o apego esconde.',
    'Quanto menos julgamos, mais compreendemos.'
  ]
};

let activeTheme = 'autoestima';
let lastMessage = '';

function setActiveChip(button) {
  themeButtons.forEach((chip) => chip.classList.remove('active'));
  button.classList.add('active');
  activeTheme = button.dataset.theme;
}

function chooseMessage() {
  const options = messages[activeTheme];
  const filtered = options.filter((text) => text !== lastMessage);
  const pick = filtered[Math.floor(Math.random() * filtered.length)];
  lastMessage = pick;
  return pick;
}

function showCard() {
  messageCard.classList.remove('hidden');
  messageCard.style.display = 'block';
  requestAnimationFrame(() => {
    messageCard.style.opacity = '1';
    messageCard.style.transform = 'translateY(0)';
  });
}

function updateMessage() {
  const nextMessage = chooseMessage();
  const themeNames = {
    autoestima: 'Autoestima',
    confianca: 'Confiança',
    presenca: 'Presença',
    coragem: 'Coragem',
    leveza: 'Leveza',
    conhecimento: 'Conhecimento',
    sabedoria: 'Sabedoria'
  };
  messageTheme.textContent = themeNames[activeTheme] || 'Autoestima';
  messageText.textContent = nextMessage;
  statusMessage.textContent = '';
  showCard();
}

function copyText(text) {
  return navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
}

function showStatus(text) {
  statusMessage.textContent = text;
}

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveChip(button);
  });
});

generateButton.addEventListener('click', () => {
  updateMessage();
});

newButton.addEventListener('click', () => {
  updateMessage();
});

saveButton.addEventListener('click', () => {
  const textToSave = messageText.textContent;
  const id = saveFavorite(activeTheme, textToSave);
  if (id) {
    showStatus('Mensagem adicionada às minhas mensagens.');
  } else {
    copyText(`${messageTheme.textContent}: ${textToSave}`).then(
      () => showStatus('Mensagem copiada para a área de transferência.'),
      () => showStatus('Não foi possível salvar a mensagem.')
    );
  }
});

shareButton.addEventListener('click', () => {
  const textToShare = `${messageTheme.textContent} — ${messageText.textContent}`;

  if (navigator.share) {
    navigator.share({
      title: 'Mensagem menteclara',
      text: textToShare
    }).catch(() => showStatus('Compartilhamento não concluído.'));
    return;
  }

  copyText(textToShare).then(
    () => showStatus('Texto copiado para compartilhar.'),
    () => showStatus('Não foi possível copiar o texto.')
  );
});

function getFavorites() {
  try {
    const data = localStorage.getItem('menteclara-favoritos');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFavorite(theme, text) {
  try {
    const favorites = getFavorites();
    const id = Date.now();
    favorites.push({
      id,
      theme,
      text,
      date: new Date().toLocaleDateString('pt-BR')
    });
    localStorage.setItem('menteclara-favoritos', JSON.stringify(favorites));
    return id;
  } catch {
    return null;
  }
}

function removeFavorite(id) {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem('menteclara-favoritos', JSON.stringify(filtered));
    renderFavorites();
  } catch {
  }
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  favorites.reverse().forEach((fav) => {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.innerHTML = `
      <div class="favorite-item-theme">${fav.theme}</div>
      <p class="favorite-item-text">${fav.text}</p>
      <p class="favorite-item-date">${fav.date}</p>
      <div class="favorite-item-actions">
        <button type="button" class="share-fav" data-id="${fav.id}">compartilhar</button>
        <button type="button" class="delete" data-id="${fav.id}">deletar</button>
      </div>
    `;
    favoritesList.appendChild(item);
  });

  document.querySelectorAll('.share-fav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fav = favorites.find((f) => f.id === parseInt(btn.dataset.id));
      if (!fav) return;
      const textToShare = `${fav.theme} — ${fav.text}`;
      if (navigator.share) {
        navigator.share({
          title: 'Mensagem menteclara',
          text: textToShare
        }).catch(() => {});
        return;
      }
      copyText(textToShare);
    });
  });

  document.querySelectorAll('.favorite-item-actions .delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFavorite(parseInt(btn.dataset.id));
    });
  });
}

function toggleView(showFavorites) {
  if (showFavorites) {
    pageContainer.style.display = 'none';
    favoritesView.classList.remove('hidden');
    renderFavorites();
  } else {
    pageContainer.style.display = 'block';
    favoritesView.classList.add('hidden');
  }
}

favLink.addEventListener('click', (e) => {
  e.preventDefault();
  toggleView(true);
});

backButton.addEventListener('click', () => {
  toggleView(false);
});

function createLeaf() {
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  const leafEmojis = ['🍂', '🍁', '🌿'];
  leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  
  const leftPosition = Math.random() * 100;
  const duration = 8 + Math.random() * 4;
  const delay = Math.random() * 2;
  
  const allThemes = Object.keys(messages);
  const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
  const themeMsgs = messages[randomTheme];
  const randomMsg = themeMsgs[Math.floor(Math.random() * themeMsgs.length)];
  
  const tooltip = document.createElement('div');
  tooltip.className = 'leaf-tooltip';
  tooltip.textContent = randomMsg;
  leaf.appendChild(tooltip);
  
  leaf.addEventListener('click', () => {
    leaf.classList.toggle('active');
  });
  
  if (Math.random() > 0.5) {
    leaf.style.animation = `fall ${duration}s linear ${delay}s infinite, sway 3s ease-in-out ${delay}s infinite`;
  } else {
    leaf.style.animation = `fall ${duration}s linear ${delay}s infinite`;
  }
  
  leavesContainer.appendChild(leaf);
}

function initializeLeaves() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      createLeaf();
    }, i * 300);
  }
}

initializeLeaves();
