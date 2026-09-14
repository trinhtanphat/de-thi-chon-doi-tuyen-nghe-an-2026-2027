from fractions import Fraction as F
from itertools import product
from math import gcd

def divisors(n):
    return [d for d in range(1,n+1) if n%d==0]
def sigma(n,k):
    return sum(d**k for d in divisors(n))
def is_good(n,k):
    return sigma(n,k)%n==0

def prime_factors(n):
    out=[]; p=2
    while p*p<=n:
        if n%p==0:
            out.append(p)
            while n%p==0: n//=p
        p += 1 if p==2 else 2
    if n>1: out.append(n)
    return out

# Câu 4: seed và nhánh A trên các ví dụ nhỏ.
for k in range(2,6):
    odd=2**k+1
    q=next(p for p in prime_factors(odd) if p%2)
    n=2*q
    assert is_good(n,k), (k,n)
    Q=sigma(n,k)//n
    new=next((p for p in prime_factors(Q) if n%p),None)
    if new:
        N=n*new
        assert N%n==0 and N>n and is_good(N,k), (k,n,N)

# Câu 5: kiểm tra tích vô hướng và điểm đồng quy cho mẫu hữu tỉ.
for b,c in [(-2,1),(-3,1),(-3,2),(-4,1)]:
    if b*c in (-1,-3) or b+c==0: continue
    A=(F(b+c,b*c+1),F(1-b*c,b*c+1)); K=(F(0),F(1+b*c))
    R=(F(b*c*(b*c+3),(b+c)*(b*c+1)),F(1,b*c+1))
    assert (K[0]-A[0])*R[0]+(K[1]-A[1])*R[1]==0
    Jx=F(b+c,b*c+3)
    t=F(1-A[1],K[1]-A[1])
    assert A[0]+t*(K[0]-A[0])==Jx
# Câu 7: brute-force toàn bộ cấu hình cho n <= 8.
for n in range(3,9):
    for k in range(2,n):
        records=set()
        injective=True
        seen={}
        for x in product((0,1),repeat=n):
            s=tuple(sum(x[(i+j)%n] for j in range(k)) for i in range(n))
            if s in seen and seen[s]!=x: injective=False
            seen[s]=x; records.add(s)
        g=gcd(n,k); m=n//g
        formula=(2**m-1)**(g-1)*(2**m+g-1)
        assert len(records)==formula,(n,k,len(records),formula)
        assert injective==(g==1),(n,k,injective,g)

# Câu 1: kiểm tra hệ số tiệm cận trên các đa thức monic mẫu P(x)=x^d+x.
for d in (5,6,9):
    n=20000
    P=lambda x,d=d:x**d+x
    Pd=lambda x,d=d:d*x**(d-1)+1
    y=n*((P(n+1)-P(n))/Pd(n)-1)
    assert abs(y-(d-1)/2)<2e-3,(d,y)

# Câu 4: đồng nhất thức dùng trong nhánh khuếch đại số mũ.
for k in range(2,7):
    for p in (2,3,5,7):
        for a in range(1,5):
            lhs=sum(p**(k*j) for j in range(2*a+2))
            rhs=sum(p**(k*j) for j in range(a+1))*(1+p**(k*(a+1)))
            assert lhs==rhs,(k,p,a)

def poly_mul(a,b):
    out=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b):out[i+j]+=x*y
    return out

def poly_eval(a,x):
    return sum(c*x**i for i,c in enumerate(a))

# Câu 6: kiểm chứng các construction đạt cận cho n=3..10.
for n in range(3,11):
    m=n//2
    coeff=[1]
    for j in range(1,m+1):coeff=poly_mul(coeff,[-j*j,0,1])
    if n%2==0:
        assert len([c for c in coeff if c])==m+1
        assert len([c for c in coeff if c])==(n+2)//2
    else:
        q=[0]+coeff
        roots=list(range(-m,m+1));delta=.1
        edge_vals=[abs(poly_eval(q,r+s*delta)) for r in roots for s in (-1,1)]
        eps=min(edge_vals)/2
        p=q[:];p[0]+=eps
        assert p[0]!=0 and len([c for c in p if c])==m+2
        for r in roots:
            assert poly_eval(p,r-delta)*poly_eval(p,r+delta)<0,(n,r)

print('MATH SANITY: PASS (C1 asymptotics, C4 construction identities, C5 coordinates, C6 sharpness, C7 exhaustive n<=8)')
