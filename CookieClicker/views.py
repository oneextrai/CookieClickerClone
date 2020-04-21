from django.shortcuts import render

def home(request):
    return render(request, 'CookieClicker/index.html')