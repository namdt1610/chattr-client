# Sửa lỗi Cấu hình API khi Deploy trên Vercel

## Vấn đề
Khi deploy ứng dụng trên Vercel, các API calls không hoạt động đúng do cấu hình proxy và URLs không phù hợp.

## Nguyên nhân
1. **Proxy configuration**: Package.json có proxy chỉ hoạt động trong development
2. **Relative URLs**: Các API calls sử dụng relative URLs không phù hợp với production
3. **Cross-origin requests**: Cần cấu hình đúng cho cross-origin requests

## Giải pháp đã áp dụng

### 1. Tạo file cấu hình API tập trung
Tạo file `src/utils/apiConfig.ts` để quản lý URLs cho cả development và production:

```typescript
export const getApiBaseUrl = () => {
    if (typeof window === 'undefined') {
        // Server-side rendering
        return process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://chatapp-backend-l6tv.onrender.com'
            : 'http://localhost:5050'
    }
    
    // Client-side
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://chatapp-backend-l6tv.onrender.com'
    }
    
    // Development - use proxy
    return ''
}

export const getSocketUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SOCKET_URL || 'https://chatapp-backend-l6tv.onrender.com'
        : 'http://localhost:5050'
}

export const buildApiUrl = (endpoint: string) => {
    const baseUrl = getApiBaseUrl()
    return baseUrl ? `${baseUrl}${endpoint}` : endpoint
}
```

### 2. Environment Variables
Tạo file `.env.local` trong thư mục `chattr-client`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://chatapp-backend-l6tv.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://chatapp-backend-l6tv.onrender.com

# SWR Configuration (optional)
NEXT_PUBLIC_SWR_REFRESH_INTERVAL=0
NEXT_PUBLIC_SWR_DEDUPE_INTERVAL=2000
NEXT_PUBLIC_SWR_RETRY_COUNT=3
```

### 3. Cấu hình Vercel Environment Variables
Trong Vercel dashboard, thêm các environment variables:

```bash
NEXT_PUBLIC_API_URL=https://chatapp-backend-l6tv.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://chatapp-backend-l6tv.onrender.com
NODE_ENV=production
```

### 4. Cập nhật tất cả hooks để sử dụng cấu hình mới
- `useLogin.ts`: Sử dụng `buildApiUrl('/api/auth/login')`
- `useRegister.ts`: Sử dụng `buildApiUrl('/api/auth/register')`
- `useLogout.ts`: Sử dụng `buildApiUrl('/api/auth/logout')`
- `useUsers.ts`: Sử dụng `buildApiUrl('/api/auth/me')` và `buildApiUrl('/api/users/${searchUser}')`
- `useChat.ts`: Sử dụng `buildApiUrl('/api/messages/history')` và `buildApiUrl('/api/messages/send')`
- `useGetRecentChats.ts`: Sử dụng `buildApiUrl('/messages/recent-chats/${userId}')`
- `useSocket.ts`: Sử dụng `getSocketUrl()`
- `swrConfig.ts`: Sử dụng `buildApiUrl('/api/auth/refresh')`

### 5. Cấu hình CORS ở Backend
Đảm bảo backend có cấu hình CORS đúng:

```typescript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://chattr-namdt1610s-projects.vercel.app']
        : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
```

## Kiểm tra và Debug

### 1. Kiểm tra Network Tab
- Mở DevTools > Network
- Thực hiện login và kiểm tra request URL
- Đảm bảo URL đúng cho production

### 2. Kiểm tra Console
- Xem có lỗi CORS không
- Xem có lỗi về URL không hợp lệ không

### 3. Kiểm tra Environment Variables
```bash
# Đảm bảo NODE_ENV được set đúng
NODE_ENV=production
```

### 4. Kiểm tra Environment Variables trong Browser
Mở DevTools > Console và chạy:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Socket URL:', process.env.NEXT_PUBLIC_SOCKET_URL)
console.log('NODE_ENV:', process.env.NODE_ENV)
```

## Các bước tiếp theo nếu vẫn có vấn đề

### 1. Kiểm tra Vercel Environment Variables
- Đảm bảo `NODE_ENV=production` được set trong Vercel
- Kiểm tra `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_SOCKET_URL` được set đúng
- Đảm bảo các environment variables có prefix `NEXT_PUBLIC_` để accessible ở client-side

### 2. Test API Endpoints trực tiếp
- Sử dụng Postman/Insomnia để test API
- Kiểm tra response từ backend

### 3. Kiểm tra Backend Deployment
- Đảm bảo backend đang chạy trên Render
- Kiểm tra logs của backend

### 4. Alternative Solutions
Nếu vẫn không hoạt động:
1. Sử dụng environment variables cho API URLs
2. Implement API route handlers trong Next.js
3. Sử dụng serverless functions

## Lưu ý quan trọng
- Đảm bảo backend URL đúng và accessible
- CORS phải được cấu hình đúng ở cả client và server
- Environment variables phải được set đúng trong Vercel
- Proxy chỉ hoạt động trong development mode
- Environment variables với prefix `NEXT_PUBLIC_` sẽ được expose ở client-side 