exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_TOKEN || !DATABASE_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '缺少 Notion 環境變數設定' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const {
      bookingTitle = 'LINE預約',
      bookingDate,
      bookingTime,
      customer = 'LINE客戶',
      services = '',
      notes = '無',
      lineUserId = ''
    } = body;

    if (!bookingDate || !bookingTime || !services) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少必要欄位' })
      };
    }

    const notionBody = {
      parent: { database_id: DATABASE_ID },
      properties: {
        預約: { title: [{ text: { content: bookingTitle } }] },
        日期: { date: { start: bookingDate } },
        時間: { rich_text: [{ text: { content: bookingTime } }] },
        客人: { rich_text: [{ text: { content: customer } }] },
        服務: { rich_text: [{ text: { content: services } }] },
        備註: { rich_text: [{ text: { content: notes || '無' } }] },
        lineUserId: { rich_text: [{ text: { content: lineUserId || '' } }] }
      }
    };

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(notionBody)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: data.message || 'Notion 寫入失敗',
          detail: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: data.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Server error' })
    };
  }
};
